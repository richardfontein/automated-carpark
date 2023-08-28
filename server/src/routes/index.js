import express from 'express';
import userRoute from './users';
import tenancyRoute from './tenancies';
import authRoute from './auth';
import billingRoute from './billing';
import loggerRoute from './logger';
import contactRoute from './contact';
import adminRoute from './admin';

const router = express.Router();

// Routes
router.use('/users', userRoute);
router.use('/tenancies', tenancyRoute);
router.use('/auth', authRoute);
router.use('/billing', billingRoute);
router.use('/logger', loggerRoute);
router.use('/contact', contactRoute);
router.use('/admin', adminRoute);

export default router;
