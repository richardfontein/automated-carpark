import logger from '../logger';

// eslint-disable-next-line no-unused-vars
const logErrors = (err, req, res, next) => {
  logger.error(err.stack);
  next(err);
};

export default logErrors;
