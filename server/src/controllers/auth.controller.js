import { authService } from '../services';

// eslint-disable-next-line import/prefer-default-export
export const authUser = async (req, res, next) => {
  // Send data to service
  try {
    const result = await authService.authUser(req.body);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};
