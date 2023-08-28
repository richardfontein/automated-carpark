import Stripe from 'stripe';
import { billingService, webhookService, xeroService } from '../services';

export const getPlans = async (req, res, next) => {
  try {
    const result = await billingService.getPlans();
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const getCustomer = async (req, res, next) => {
  // Extract id from authenticated request
  const { id } = req.user;

  try {
    const result = await billingService.getCustomer(id);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const createCard = async (req, res, next) => {
  // Extract id from authenticated request
  const { id } = req.user;
  const { token } = req.body;

  // Send data to service
  try {
    const result = await billingService.createCard(id, token);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const updateCard = async (req, res, next) => {
  // Extract id from authenticated request
  const { id } = req.user;
  const { token } = req.body;

  // Send data to service
  try {
    const result = await billingService.updateCard(id, token);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
export const stripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = Stripe.webhooks.constructEvent(req.rawBody, sig, stripeWebhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    const eventData = event.data.object;

    switch (event.type) {
      case 'invoice.payment_succeeded':
        webhookService.handlePaymentChargeSucceeded(eventData);
        break;
      case 'invoice.payment_failed':
        webhookService.handlePaymentChargeFailed(eventData);
        break;
      case 'customer.source.created':
        webhookService.handleCustomerSourceUpdated(eventData);
        break;
      default:
        res.status(400).end();
    }

    // Return a response to acknowledge receipt of the event
    return res.json({ received: true });
  } catch (e) {
    return next(e);
  }
};

export const getInvoices = async (req, res, next) => {
  // Extract id from authenticated request body
  const userId = req.user.id;
  const { limit, startingAfter } = req.query;

  // Send data to service
  try {
    const result = await billingService.getInvoices(userId, limit, startingAfter);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const getXeroInvoiceUrl = async (req, res, next) => {
  const { id } = req.params;
  try {
    const xeroInvoiceUrl = await xeroService.getXeroInvoiceUrl(id);
    res.redirect(xeroInvoiceUrl);
  } catch (e) {
    next(e);
  }
};

export const getXeroInvoicePdfUrl = async (req, res, next) => {
  const { id } = req.params;
  try {
    const xeroInvoiceUrl = await xeroService.getXeroInvoicePdfUrl(id);
    res.redirect(xeroInvoiceUrl);
  } catch (e) {
    next(e);
  }
};
