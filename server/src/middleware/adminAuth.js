import jwt from 'jsonwebtoken';

import { AuthenticationError } from '../status/clientErrorCodes';

const jwtSecret = process.env.JWT_SECRET;
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');

  // Check for token
  if (!token) {
    throw new AuthenticationError('No token, authorization denied');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);

    // Add user from payload
    req.user = decoded;

    if (decoded.role !== 'administrator') {
      throw new AuthenticationError('Invalid user');
    }

    next();
  } catch (e) {
    throw new AuthenticationError('Token is not valid');
  }

  return 0;
};

export default auth;
