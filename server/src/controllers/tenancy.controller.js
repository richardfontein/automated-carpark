import { tenancyService } from '../services';

export const getTenancies = async (req, res, next) => {
  // Extract id from authenticated request body
  const userId = req.user.id;

  // Send data to service
  try {
    const result = await tenancyService.getTenancies(userId);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const createTenancy = async (req, res, next) => {
  // Extract id from authenticated request body
  const userId = req.user.id;

  // Set data
  const data = {
    userId,
    ...req.body,
  };

  // Send data to service
  try {
    const result = await tenancyService.createTenancy(data);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const updateTenancy = async (req, res, next) => {
  // Extract id from authenticated request body
  const userId = req.user.id;

  // Set data
  const data = {
    userId,
    ...req.body,
  };

  // Send data to service
  try {
    const result = await tenancyService.updateTenancy(data);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const deleteTenancy = async (req, res, next) => {
  // Extract id data from query parameters and authenticated request body
  const tenancyId = req.params.id;
  const userId = req.user.id;

  // Send data to service
  try {
    const result = await tenancyService.deleteTenancy(tenancyId, userId);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};
