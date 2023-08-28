import axios from 'axios';
import { returnErrors } from './errorActions';

const config = { headers: { 'Content-Type': 'application/json' } };

// Register User
// eslint-disable-next-line import/prefer-default-export
export const sendContactQuery = data => async dispatch =>
  axios.post('/api/contact', data, config).catch((err) => {
    dispatch(returnErrors(err.response.data, err.response.status));
    return Promise.reject(err.response.data.errors);
  });
