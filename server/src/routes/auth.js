import express from 'express';
import validator from '../middleware/validation';
import { authSchema } from '../schemas';
import { authController } from '../controllers';

const router = express.Router();

/**
 * @route   POST /api/auth
 * @desc    Authenticate user
 * @access  Public
 */
router.post('/', validator(authSchema), authController.authUser);

export default router;
