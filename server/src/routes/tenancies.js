import express from 'express';
import auth from '../middleware/auth';
import validator from '../middleware/validation';
import { tenancySchema } from '../schemas';
import { tenancyController } from '../controllers';

const router = express.Router();

/**
 * @route   GET /api/tenancies
 * @desc    Get tenancy list
 * @access  Private
 */
router.get('/', auth, tenancyController.getTenancies);

/**
 * @route   POST /api/tenancies
 * @desc    Add tenancy
 * @access  Private
 */
router.post('/', auth, validator(tenancySchema), tenancyController.createTenancy);

/**
 * @route   PUT /api/tenancies/:id
 * @desc    Edit tenancy
 * @access  Private
 */
router.put('/:id', auth, tenancyController.updateTenancy);

/**
 * @route   DELETE /api/tenancies/:id
 * @desc    Delete a tenancy and its associated plates
 * @access  Private
 */
router.delete('/:id', auth, tenancyController.deleteTenancy);

export default router;
