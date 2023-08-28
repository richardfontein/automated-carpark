import express from 'express';
import logger from '../logger';

const router = express.Router();

/**
 * @route   POST /api/logger
 * @desc    Post frontend error
 * @access  Public
 */
// eslint-disable-next-line no-unused-vars
router.post('/', async (req, res, next) => {
  const { message } = req.body;

  try {
    logger.error(message);
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
});

export default router;
