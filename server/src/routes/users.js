import express from 'express';

import auth from '../middleware/auth';
import validator from '../middleware/validation';
import {
  userSchema,
  updateUserSchema,
  updatePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas';
import { userController } from '../controllers';

const router = express.Router();

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Public
 */
router.post('/', validator(userSchema), userController.createUser);

/**
 * @route   GET /api/users
 * @desc    Get a user
 * @access  Private
 */
router.get('/', auth, userController.getUser);

/**
 * @route   PUT /api/users
 * @desc    Update a user
 * @access  Private
 */
router.put('/', auth, validator(updateUserSchema), userController.updateUser);

/**
 * @route   PUT /api/users/password
 * @desc    Updates a user password while user is already logged in
 * @access  Private
 */
router.put('/password', auth, validator(updatePasswordSchema), userController.updatePassword);

/**
 * @route   POST /api/users/forgot
 * @desc    Sends an email with a reset password link
 * @access  Public
 */
router.post('/forgot', validator(forgotPasswordSchema), userController.forgotPassword);

/**
 * @route   PUT /api/users/reset
 * @desc    Updates a user's password after they've forgotten it
 * @access  Public
 */
router.put('/reset', validator(resetPasswordSchema), userController.resetPassword);

export default router;
