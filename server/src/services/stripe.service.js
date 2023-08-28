import Stripe from 'stripe';
import { BadRequestError, PaymentRequiredError } from '../status/clientErrorCodes';
import { RetrievedResource, CreatedResource, UpdatedResource } from '../status/successCodes';

const { STRIPE_GST_NZ, ICL_GST_NUMBER } = process.env;
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const getCustomer = async (customerId) => {
  if (!customerId) {
    return { data: {}, status: 200 };
  }

  try {
    const customer = await stripe.customers.retrieve(customerId);

    return await new RetrievedResource(customer);
  } catch (e) {
    throw new BadRequestError(e.message, 'customer');
  }
};

export const createCustomer = async (user, tokenId) => {
  try {
    const customer = await stripe.customers.create({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      source: tokenId,
      metadata: {
        userId: user.id,
      },
      invoice_settings: {
        custom_fields: [
          {
            name: 'GST Number',
            value: ICL_GST_NUMBER,
          },
        ],
      },
    });

    return await new CreatedResource(customer);
  } catch (e) {
    throw new BadRequestError(e.message, 'card');
  }
};

export const updateCustomer = async (user, tokenId) => {
  try {
    const customer = await stripe.customers.update(user.stripeCustomerId, {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      source: tokenId,
      metadata: {
        userId: user.id,
      },
    });

    return await new UpdatedResource(customer);
  } catch (e) {
    throw new BadRequestError(e.message, 'card');
  }
};

export const createSubscription = async (customerId, planId, paymentBehaviour) => {
  try {
    return await stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: planId }],
      default_tax_rates: [STRIPE_GST_NZ],
      payment_behavior: paymentBehaviour || 'error_if_incomplete',
    });
  } catch (e) {
    throw new PaymentRequiredError(e.message, 'card');
  }
};

export const deleteSubscription = async (subscriptionId) => {
  try {
    return await stripe.subscriptions.del(subscriptionId);
  } catch (e) {
    throw e;
  }
};

export const createSubscriptionItem = async (subscriptionId, planId) => {
  try {
    const subscriptionItem = await stripe.subscriptionItems.create({
      subscription: subscriptionId,
      plan: planId,
      prorate: false,
    });

    return subscriptionItem.id;
  } catch (e) {
    throw e;
  }
};

export const updateSubscriptionItem = async (subscriptionItemId, planId, quantity) => {
  try {
    return await stripe.subscriptionItems.update(subscriptionItemId, {
      plan: planId,
      quantity,
      prorate: false,
    });
  } catch (e) {
    throw e;
  }
};

export const deleteSubscriptionItem = async (subscriptionItemId) => {
  try {
    return await stripe.subscriptionItems.del(subscriptionItemId);
  } catch (e) {
    throw e;
  }
};

export const createInvoiceItem = async (
  customerId,
  amount,
  period,
  vehicleType,
  daysRemainingThisBillingCycle,
  baseAmount,
) => {
  try {
    return await stripe.invoiceItems.create({
      customer: customerId,
      amount,
      currency: 'nzd',
      period,
      description: `${1} × ${vehicleType} Parking (${daysRemainingThisBillingCycle} days at $${(
        baseAmount / 100
      ).toFixed(2)} / month)`,
    });
  } catch (e) {
    throw e;
  }
};

export const createInvoice = async (customerId, subscriptionId, tenancy) => {
  try {
    return await stripe.invoices.create({
      customer: customerId,
      subscription: subscriptionId,
      auto_advance: false,
      default_tax_rates: [STRIPE_GST_NZ],
      metadata: { userId: tenancy.userId, tenancyId: tenancy.id },
    });
  } catch (e) {
    throw e;
  }
};

export const updateInvoice = async (invoiceId, tenancy) => {
  try {
    return await stripe.invoices.update(invoiceId, {
      metadata: { userId: tenancy.userId, tenancyId: tenancy.id },
    });
  } catch (e) {
    throw e;
  }
};

export const finalizeInvoice = async (invoiceId) => {
  try {
    return await stripe.invoices.finalizeInvoice(invoiceId);
  } catch (e) {
    throw new BadRequestError(e.message, 'card');
  }
};

export const payInvoice = async (invoiceId) => {
  try {
    return await stripe.invoices.pay(invoiceId);
  } catch (e) {
    throw new PaymentRequiredError(e.message, 'card');
  }
};

export const getInvoices = async (customerId, limit, status, startingAfter) => {
  if (!customerId) {
    return { data: { data: [], has_more: false }, status: 200 };
  }

  try {
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit,
      starting_after: startingAfter,
      status,
    });

    return await { data: invoices, status: 200 }; // send as raw object to avoid recursion in getter
  } catch (e) {
    throw e;
  }
};

export const getSubscriptions = async (subscriptionId) => {
  if (!subscriptionId) {
    return { data: [] };
  }

  try {
    return await stripe.subscriptionItems.list({
      subscription: subscriptionId,
    });
  } catch (e) {
    throw e;
  }
};
