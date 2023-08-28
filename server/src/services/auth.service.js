import jwt from 'jsonwebtoken';

import { authDb } from '../db';

const EXPIRES_IN = 86400;

const jwtSecret = process.env.JWT_SECRET;
export const signToken = data =>
  jwt.sign({ ...data }, jwtSecret, {
    expiresIn: EXPIRES_IN,
  });

export const authUser = async (user) => {
  try {
    const result = await authDb.authUser(user);
    if (result.data.success === false) {
      // User not authenticated, return
      return result;
    }

    // Sign token
    const token = signToken({ id: result.data.id, role: result.data.role });

    // Reassign data to object
    result.data = { token, user: result.data };

    return result;
  } catch (e) {
    throw e;
  }
};

export const authAdmin = async (user) => {
  try {
    const result = await authDb.authAdmin(user);
    if (result.data.success === false) {
      // User not authenticated, return
      return result;
    }

    // Sign token
    const token = signToken({ id: result.data.id, role: result.data.role });

    // Reassign data to object
    result.data = { token, user: result.data };

    return result;
  } catch (e) {
    throw e;
  }
};
