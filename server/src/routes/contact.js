import express from 'express';

import { contactController } from '../controllers';

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Post contact form
 * @access  Public
 */
// eslint-disable-next-line no-unused-vars
router.post('/', contactController.postContactQuery);

export default router;
