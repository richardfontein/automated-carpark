import { userDb, tenancyDb } from '../db';
import logger from '../logger';
import * as emailService from './email.service';
import * as stripeService from './stripe.service';
import * as tenancyService from './tenancy.service';

export const handlePaymentChargeSucceeded = async (charge) => {
  try {
    const invoiceItems = charge.lines.data.map(item => ({
      stripeInvoiceItemId: item.id,
      description: item.description,
      amount: item.amount,
    }));

    const invoice = {
      stripeInvoiceId: charge.id,
      stripeInvoiceUrl: charge.invoice_pdf,
      name: charge.customer_name,
      email: charge.customer_email,
      subtotal: charge.subtotal,
      total: charge.total,
      date: new Date(charge.created * 1000), // stripe stores dates in seconds
      invoiceItems,
    };

    // If the invoice was generated during the subscription cycle
    // Resume all paused tenancies and send charge succeeded email
    switch (charge.billing_reason) {
      case 'subscription_cycle': {
        const user = await userDb.getUserByStripeCustomerId(charge.customer);
        const tenancies = await tenancyService.getTenancies(user.id);

        tenancies.get().forEach(async (tenancy) => {
          if (tenancy.subscriptionStarted && !tenancy.subscriptionEnded && !tenancy.paid) {
            await tenancyService.resumeTenancy(tenancy);
          }
        });

        break;
      }
      // If invoice was generated manually and the tenancy exists
      // (ie. invoice generated through startTenancies schedule)
      case 'subscription_create':
      case 'manual': {
        const { tenancyId } = charge.metadata;

        if (tenancyId) {
          try {
            const tenancy = await tenancyDb.getTenancy(tenancyId);
            await tenancyService.resumeTenancy(tenancy.get());
          } catch (e) {
            // Tenancy does not exist
            break;
          }
        }

        break;
      }
      default:
        break;
    }
    await emailService.sendReceiptSuccess(invoice);
  } catch (e) {
    logger.error(`Charge with id ${charge.id} could not be handled\n${e.stack}`);
  }
};

export const handlePaymentChargeFailed = async (charge) => {
  try {
    const invoiceItems = charge.lines.data.map(item => ({
      stripeInvoiceItemId: item.id,
      description: item.description,
      amount: item.amount,
    }));

    const invoice = {
      email: charge.customer_email,
      subtotal: charge.subtotal,
      total: charge.total,
      invoiceItems,
    };

    // If the invoice was generated during the subscription cycle
    // Pause all active tenancies and send charge failed email
    switch (charge.billing_reason) {
      case 'subscription_cycle': {
        const user = await userDb.getUserByStripeCustomerId(charge.customer);
        const tenancies = await tenancyService.getTenancies(user.id);

        tenancies.get().forEach(async (tenancy) => {
          if (tenancy.subscriptionStarted && !tenancy.subscriptionEnded) {
            await tenancyService.pauseTenancy(tenancy);
          }
        });

        // Send email indicating failure failure
        await emailService.sendReceiptFailed(invoice);

        break;
      }
      // If invoice was generated manually and the tenancy exists
      // (ie. through startTenancies schedule)
      case 'manual': {
        const { tenancyId } = charge.metadata;
        // Send failed notification
        if (tenancyId) {
          try {
            await tenancyDb.getTenancy(tenancyId);
            await emailService.sendReceiptFailed(invoice);
          } catch (e) {
            // Tenancy does not exist
            break;
          }
        }

        break;
      }
      // If invoice was generated through subscription creation and the tenancy exists
      // (ie. through startTenancies schedule)
      case 'subscription_create': {
        const user = await userDb.getUserByStripeCustomerId(charge.customer);
        const tenancies = await tenancyService.getTenancies(user.id);

        if (tenancies.get().length > 0) {
          emailService.sendReceiptFailed(invoice);
        }

        break;
      }
      default:
        break;
    }
  } catch (e) {
    logger.error(`Charge with id ${charge.id} could not be handled\n${e.stack}`);
  }
};

// Retries all outstanding invoices when customer card (source) is updated
export const handleCustomerSourceUpdated = async (source) => {
  try {
    const invoices = await stripeService.getInvoices(source.customer, 100, 'open');

    invoices.data.data.forEach(async (invoice) => {
      try {
        await stripeService.payInvoice(invoice.id);
      } catch (e) {
        logger.error(`Invoice with id ${invoice.id} could not be paid`);
      }
    });
  } catch (e) {
    logger.error(`Customer source updated with id ${source.id} could not be handled\n${e.stack}`);
  }
};
