import { BadRequestError } from '../status/clientErrorCodes';

// abortEarly evaluates all errors for all fields, stripUnknown removes fields not in schema
const options = { abortEarly: false, stripUnknown: true, context: {} };

const validator = schema => async (req, res, next) => {
  const data = { ...req.params, ...req.body };

  await schema
    .validate(data, options)
    .then((values) => {
      req.body = values;
      next();
    })
    .catch((err) => {
      // If error does not have inner, pass down chain
      if (!err.inner) {
        next(err);
      }

      // Reduce Yup ValidationErrors object into simple object with field name (path) as key
      const errors = err.inner.reduce((obj, item) => ({ ...obj, [item.path]: item.message }), {});
      next(new BadRequestError(errors));
    });
};

export default validator;
