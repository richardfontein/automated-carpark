// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  res
    .status(500)
    .json({ errors: { ServerError: 'Something went wrong. Please try again later.' } });
};

export default errorHandler;
