/**
 * Response data formatted as per JSend specification
 * see https://github.com/omniti-labs/jsend for more details
 */

export class ClientError extends Error {
  constructor(message, field, status) {
    super();
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = status;

    if (typeof message === 'string') {
      // If message is a string, assign message to the given field
      this.message = message;
      this.data = { errors: { [field || this.name]: message } };
    } else {
      // If message is an object, assign message to errors
      this.data = { errors: message };
    }
  }
}

export class BadRequestError extends ClientError {
  constructor(message, field) {
    super(message || 'Bad request', field, 400);
  }
}

export class AuthenticationError extends ClientError {
  constructor(message, field) {
    super(message || 'AuthenticationError', field, 401);
  }
}

export class PaymentRequiredError extends ClientError {
  constructor(message, field) {
    super(message || 'PaymentRequiredError', field, 402);
  }
}

export class AuthorizationError extends ClientError {
  constructor(message, field) {
    super(message || 'AuthorizationError', field, 403);
  }
}

export class NotFoundError extends ClientError {
  constructor(message, field) {
    super(message || 'Resource not found', field, 404);
  }
}
