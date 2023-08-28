import express from 'express';

import adminAuth from '../middleware/adminAuth';
import { adminController } from '../controllers';

const router = express.Router();

/**
 * @route   POST /api/admin/auth
 * @desc    Login an administrator
 * @access  Public
 */
router.post('/auth', adminController.authAdmin);

/**
 * @route   GET /api/admin/
 * @desc    Get all users
 * @access  Private
 */
router.get('/', adminAuth, adminController.getAdmin);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private
 */
router.get('/users', adminAuth, adminController.getUsers);

/**
 * @route   POST /api/admin/users
 * @desc    Create a user
 * @access  Private
 */
router.post('/users', adminAuth, adminController.createUser);

/**
 * @route   PUT /api/admin/users
 * @desc    Update a user
 * @access  Private
 */
router.put('/users', adminAuth, adminController.updateUser);

/**
 * @route   GET /api/admin/invoices/:id
 * @desc    Get invoices for a user
 * @access  Private
 */
router.get('/invoices/:id', adminAuth, adminController.getInvoices);

/**
 * @route   GET /api/admin/xeroContacts
 * @desc    Get all Xero contacts
 * @access  Private
 */
router.get('/xeroContacts', adminAuth, adminController.getXeroContacts);

/**
 * @route   GET /api/admin/customers/:id
 * @desc    Get customer
 * @access  Private
 */
router.get('/customers/:id', adminAuth, adminController.getCustomer);

/**
 * @route   GET /api/admin/tenancies
 * @desc    Get all tenancies
 * @access  Private
 */
router.get('/tenancies', adminAuth, adminController.getAllTenancies);

/**
 * @route   GET /api/admin/tenancies/:id
 * @desc    Get a users tenancies
 * @access  Private
 */
router.get('/tenancies/:id', adminAuth, adminController.getTenancies);

/**
 * @route   PUT /api/admin/tenancies/:id
 * @desc    Edit tenancy
 * @access  Private
 */
router.put('/tenancies/:id', adminAuth, adminController.updateTenancy);

export default router;
