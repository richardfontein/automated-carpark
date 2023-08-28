import express from 'express';

import auth from '../middleware/auth';
import { billingController } from '../controllers';

const router = express.Router();

/**
 * @route   GET /api/billing/plans
 * @desc    Get prices
 * @access  Public
 */
router.get('/prices', billingController.getPlans);

/**
 * @route   GET /api/billing/card
 * @desc    Get a customer
 * @access  Private
 */
router.get('/', auth, billingController.getCustomer);

/**
 * @route   POST /api/billing/card
 * @desc    Create new card
 * @access  Private
 */
router.post('/card', auth, billingController.createCard);

/**
 * @route   PUT /api/billing/card
 * @desc    Update a card
 * @access  Private
 */
router.put('/card', auth, billingController.updateCard);

/**
 * @route   POST /api/billing/webhook
 * @desc    Stripe webhook endpoint
 * @access  Public
 */
router.post('/webhook', billingController.stripeWebhook);

/**
 * @route   GET /api/billing/invoices
 * @desc    Get invoices for a user
 * @access  Private
 */
router.get('/invoices', auth, billingController.getInvoices);

/**
 * @route   GET /api/billing/invoices/xero/:id
 * @desc    Get xero invoice url for an invoice
 * @access  Public
 */
router.get('/invoices/xero/:id', billingController.getXeroInvoiceUrl);

/**
 * @route   GET /api/billing/invoices/xero/:id
 * @desc    Get xero invoice url for an invoice
 * @access  Public
 */
router.get('/invoices/pdf/:id', billingController.getXeroInvoicePdfUrl);

export default router;
