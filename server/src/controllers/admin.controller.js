import {
 billingService, xeroService, tenancyService, authService, userService, 
} from '../services';

export const authAdmin = async (req, res, next) => {
  // Send data to service
  try {
    const result = await authService.authAdmin(req.body);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const getAdmin = async (req, res, next) => {
  // Send data to service
  try {
    const result = await userService.getUser(req.user.id);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const getUsers = async (req, res, next) => {
  // Send data to service
  try {
    const result = await userService.getUsers();
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const createUser = async (req, res, next) => {
  const data = req.body;

  // Send data to service
  try {
    const result = await userService.createUser(data);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const updateUser = async (req, res, next) => {
  const data = req.body;

  // Send data to service
  try {
    const result = await userService.updateUser(data);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const getInvoices = async (req, res, next) => {
  // Extract id from authenticated request body
  const userId = req.params.id;
  const { limit, startingAfter } = req.query;

  // Send data to service
  try {
    const result = await billingService.getInvoices(userId, limit, startingAfter);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const getXeroContacts = async (req, res, next) => {
  try {
    const result = await xeroService.getContacts();
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const getCustomer = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await billingService.getCustomer(id);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const getTenancies = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await tenancyService.getTenancies(id);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const getAllTenancies = async (req, res, next) => {
  try {
    const result = await tenancyService.getAllTenancies();
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const updateTenancy = async (req, res, next) => {
  // Set data
  const data = req.body;

  // Send data to service
  try {
    const result = await tenancyService.updateTenancy(data, 'administrator');
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};
