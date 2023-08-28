import { ClientError } from '../status/clientErrorCodes';

const clientErrorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.status).json(err.data);
  }
  return next(err);
};

export default clientErrorHandler;
