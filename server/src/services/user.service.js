import { UniqueConstraintError } from 'sequelize';
import { userDb } from '../db';
import { UpdatedResource } from '../status/successCodes';
import { BadRequestError } from '../status/clientErrorCodes';
import * as authService from './auth.service';
import * as emailService from './email.service';
import * as stripeService from './stripe.service';

export const createUser = async (user) => {
  try {
    const result = await userDb.createUser(user);

    // Sign token
    const token = authService.signToken({ id: result.id, role: result.role });

    // Reassign data to object
    result.data = { token, user: result.data };

    return result;
  } catch (e) {
    throw e;
  }
};

export const getUser = async (id) => {
  try {
    return await userDb.getUser(id);
  } catch (e) {
    throw e;
  }
};

export const getUsers = async () => {
  try {
    return await userDb.getUsers();
  } catch (e) {
    throw e;
  }
};

export const updateUser = async (user) => {
  try {
    const updatedUser = await userDb.updateUser(user);
    if (updatedUser.stripeCustomerId) {
      await stripeService.updateCustomer(updatedUser);
    }

    return await updatedUser;
  } catch (e) {
    if (e instanceof UniqueConstraintError) {
      const key = Object.keys(e.fields)[0];
      throw new BadRequestError(`${key} already in use`, key);
    }

    throw e;
  }
};

export const updatePassword = async (data) => {
  try {
    return await userDb.updatePassword(data);
  } catch (e) {
    throw e;
  }
};

export const forgotPassword = async (data) => {
  try {
    const user = await userDb.updatePasswordToken(data);
    await emailService.sendPasswordToken(user);

    return new UpdatedResource();
  } catch (e) {
    throw e;
  }
};

export const resetPassword = async (data) => {
  try {
    const result = await userDb.resetPassword(data);

    // Sign token
    const token = authService.signToken({ id: result.id, role: result.role });

    // Reassign data to object
    result.data = { token, user: result.data };

    return result;
  } catch (e) {
    throw e;
  }
};
