import bcrypt from 'bcryptjs';
import User from './models/User';

import { BadRequestError } from '../status/clientErrorCodes';
import { RetrievedResource } from '../status/successCodes';

// eslint-disable-next-line import/prefer-default-export
export const authUser = async data =>
  // Check for existing user
  User.findOne({
    where: { email: data.email },
    attributes: {
      include: ['password'],
    },
  }).then(async (user) => {
    if (!user) {
      throw new BadRequestError('Incorrect email or password', 'email');
    }

    // Validate password
    return bcrypt.compare(data.password, user.password).then(async (isMatch) => {
      // Password does not match
      if (!isMatch) {
        throw new BadRequestError('Incorrect email or password', 'email');
      }

      // User authenticated, remove password and return
      const { password, ...userWithoutPassword } = user.get();
      return new RetrievedResource(userWithoutPassword);
    });
  });

export const authAdmin = async data =>
  // Check for existing user
  User.findOne({
    where: { email: data.email, role: 'administrator' },
    attributes: {
      include: ['password'],
    },
  }).then(async (user) => {
    if (!user) {
      throw new BadRequestError('Incorrect email or password', 'email');
    }

    // Validate password
    return bcrypt.compare(data.password, user.password).then(async (isMatch) => {
      // Password does not match
      if (!isMatch) {
        throw new BadRequestError('Incorrect email or password', 'email');
      }

      // User authenticated, remove password and return
      const { password, ...userWithoutPassword } = user.get();
      return new RetrievedResource(userWithoutPassword);
    });
  });
