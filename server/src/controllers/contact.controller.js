import { emailService } from '../services';

// eslint-disable-next-line import/prefer-default-export
export const postContactQuery = async (req, res, next) => {
  const data = req.body;

  try {
    await emailService.sendContactQuery(data);
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};
