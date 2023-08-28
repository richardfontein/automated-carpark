import { differenceInDays, differenceInMonths } from 'date-fns';
import { userDb, billingDb } from '../db';
import * as stripeService from './stripe.service';
import * as xeroService from './xero.service';
import { convertTzDate, AUCKLAND_IANTZ_CODE, addMonths } from '../util';
import { BadRequestError } from '../status/clientErrorCodes';

const getProration = (amount, billingCycleAnchor) => {
  const today = convertTzDate(new Date(), AUCKLAND_IANTZ_CODE);
  const nextBillingDate = addMonths(
    billingCycleAnchor || today,
    differenceInMonths(today, billingCycleAnchor) + 1,
  );
  const daysRemainingThisBillingCycle = differenceInDays(nextBillingDate, today);
  const daysThisBillingCycle = differenceInDays(addMonths(today, 1), today);

  let proratedAmount;
  if (
    daysRemainingThisBillingCycle === 0
    || daysRemainingThisBillingCycle >= daysThisBillingCycle
  ) {
    proratedAmount = amount;
  } else {
    proratedAmount = Math.floor((daysRemainingThisBillingCycle / daysThisBillingCycle) * amount);
  }

  return { proratedAmount, daysRemainingThisBillingCycle };
};

export const getBillingPeriod = (billingCycleAnchor) => {
  const today = convertTzDate(new Date(), AUCKLAND_IANTZ_CODE);
  const nextBillingDate = addMonths(
    billingCycleAnchor,
    differenceInMonths(today, billingCycleAnchor) + 1,
  );

  return { start: today, end: nextBillingDate };
};

export const getPlans = async () => {
  try {
    return await billingDb.getPlans();
  } catch (e) {
    throw e;
  }
};

export const getCustomer = async (userId) => {
  try {
    const { corporateCarparks, stripeCustomerId, xeroContactId } = await userDb.getUser(userId);

    let customer;
    if (corporateCarparks === 0) {
      customer = await stripeService.getCustomer(stripeCustomerId);
    } else {
      customer = await xeroService.getContact(xeroContactId);
    }

    return customer;
  } catch (e) {
    throw e;
  }
};

export const createCard = async (userId, token) => {
  try {
    // Fetch user
    const user = await userDb.getUser(userId);
    if (user.stripeCustomerId) {
      return await stripeService.updateCustomer(user, token.id);
    }

    // Create customer and add stripeCustomerId to user
    const customer = await stripeService.createCustomer(user, token.id);
    await userDb.updateUser({ ...user.get(), stripeCustomerId: customer.id });

    return customer;
  } catch (e) {
    throw e;
  }
};

export const updateCard = async (userId, token) => {
  try {
    // Fetch user
    const user = await userDb.getUser(userId);

    return await stripeService.updateCustomer(user, token.id);
  } catch (e) {
    throw e;
  }
};

export const addSubscriptionItem = async (tenancy, paymentBehaviour) => {
  try {
    const {
      plan: { stripeId: stripePlanId, amount },
      userId,
      vehicleType,
    } = tenancy;
    const user = await userDb.getUser(userId);
    let subscriptionItem;
    let error = null;

    // Throw error if customer has no stripe customer id
    if (!user.stripeCustomerId) {
      throw new BadRequestError('No card registered', 'card');
    }

    // Check if user already has a subscription
    if (user.stripeSubscriptionId) {
      // Calculate pro-rated cost and charge
      const { proratedAmount, daysRemainingThisBillingCycle } = getProration(
        amount,
        user.billingCycleAnchor,
      );
      const period = getBillingPeriod(user.billingCycleAnchor);
      await stripeService.createInvoiceItem(
        user.stripeCustomerId,
        proratedAmount,
        period,
        vehicleType,
        daysRemainingThisBillingCycle,
        amount,
      );
      const proratedInvoice = await stripeService.createInvoice(
        user.stripeCustomerId,
        user.stripeSubscriptionId,
        tenancy,
      );

      try {
        await stripeService.finalizeInvoice(proratedInvoice.id);
        await stripeService.payInvoice(proratedInvoice.id);
      } catch (e) {
        if (paymentBehaviour === 'allow_incomplete') {
          // Continues creating subscription if payment behaviour is allow incomplete
          // (ie. through start tenancies)
          // saves error to be thrown before function returns
          error = e;
        } else {
          throw e;
        }
      }

      const subscriptionItems = await stripeService.getSubscriptions(user.stripeSubscriptionId);
      subscriptionItem = subscriptionItems.data.find(item => item.plan.id === stripePlanId);

      // Update the subscription (with proration disabled)
      if (subscriptionItem) {
        // Subscription item exists, increment the quantity of the plan
        await stripeService.updateSubscriptionItem(
          subscriptionItem.id,
          stripePlanId,
          subscriptionItem.quantity + 1,
        );
      } else {
        // Subscription item does not exist, create new subscription item
        await stripeService.createSubscriptionItem(user.stripeSubscriptionId, stripePlanId);
      }
    } else {
      // User does not have a subscription, create a new one
      // (creates a new subscription item in parallel)
      const billingCycleAnchor = convertTzDate(new Date(), AUCKLAND_IANTZ_CODE);
      const newSubscription = await stripeService.createSubscription(
        user.stripeCustomerId,
        stripePlanId,
        paymentBehaviour,
      );

      await stripeService.updateInvoice(newSubscription.latest_invoice, tenancy);

      if (newSubscription.status === 'incomplete') {
        error = new Error('Your card was declined');
      }

      // Add subscriptionId to user
      await userDb.updateUser({
        id: userId,
        stripeSubscriptionId: newSubscription.id,
        billingCycleAnchor,
      });
    }

    if (error) {
      throw error;
    }

    return subscriptionItem;
  } catch (e) {
    throw e;
  }
};

export const deleteSubscriptionItem = async (tenancy) => {
  try {
    const {
      plan: { stripeId: stripePlanId },
      userId,
    } = tenancy;
    const user = await userDb.getUser(userId);

    // Fetch the subscription item for the tenancy's plan
    const subscriptionItems = await stripeService.getSubscriptions(user.stripeSubscriptionId);
    const subscriptionItemsQuantity = subscriptionItems.data.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const subscriptionItem = subscriptionItems.data.find(item => item.plan.id === stripePlanId);

    // If total quantity of all subscription items is 1, delete subscription
    if (subscriptionItemsQuantity === 1) {
      await stripeService.deleteSubscription(user.stripeSubscriptionId);
      await userDb.updateUser({ id: userId, stripeSubscriptionId: null, billingCycleAnchor: null });
    } else if (subscriptionItem.quantity === 1) {
      // Delete subscriptionItem if it's quantity is 1
      await stripeService.deleteSubscriptionItem(subscriptionItem.id);
    } else {
      // Update subscriptionItem with one less
      await stripeService.updateSubscriptionItem(
        subscriptionItem.id,
        stripePlanId,
        subscriptionItem.quantity - 1,
      );
    }

    return subscriptionItem;
  } catch (e) {
    throw e;
  }
};

export const getInvoices = async (userId, limit, startingAfter) => {
  try {
    const { corporateCarparks, stripeCustomerId, xeroContactId } = await userDb.getUser(userId);

    let invoices;
    if (corporateCarparks === 0) {
      invoices = await stripeService.getInvoices(stripeCustomerId, limit, 'paid', startingAfter);
    } else {
      invoices = await xeroService.getInvoices(xeroContactId);
    }

    return invoices;
  } catch (e) {
    throw e;
  }
};
