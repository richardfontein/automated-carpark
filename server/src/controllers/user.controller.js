import { userService } from '../services';

export const createUser = async (req, res, next) => {
  // Send data to service
  try {
    const result = await userService.createUser(req.body);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const getUser = async (req, res, next) => {
  // Send data to service
  try {
    const result = await userService.getUser(req.user.id);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const updateUser = async (req, res, next) => {
  // Extract id from authenticated request
  const { id } = req.user;

  // Set data
  const data = {
    id,
    ...req.body,
  };

  // Send data to service
  try {
    const result = await userService.updateUser(data);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const updatePassword = async (req, res, next) => {
  // Extract id from authenticated request
  const { id } = req.user;

  // Set data
  const data = {
    id,
    ...req.body,
  };

  // Send data to service
  try {
    const result = await userService.updatePassword(data);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const forgotPassword = async (req, res, next) => {
  // Send data to service
  try {
    const result = await userService.forgotPassword(req.body);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const resetPassword = async (req, res, next) => {
  // Send data to service
  try {
    const result = await userService.resetPassword(req.body);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};
