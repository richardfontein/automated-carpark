import axios from 'axios';
import { returnErrors } from './errorActions';
import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  UPDATE_USER,
  UPDATE_PASSWORD,
  FORGOT_PASSWORD,
  RESET_PASSWORD_SUCCESS,
} from './types';
import { convertTzDate, AUCKLAND_IANTZ_CODE } from '../library/util/date';

const config = { headers: { 'Content-Type': 'application/json' } };

// Parses dates in user object
const parseUser = user => ({
  ...user,
  billingCycleAnchor: user.billingCycleAnchor
    ? new Date(user.billingCycleAnchor)
    : convertTzDate(new Date(), AUCKLAND_IANTZ_CODE),
});

// Setup config/headers and token
export const tokenConfig = (getState) => {
  // Get token from localStorage
  const { token } = getState().auth;

  // If token, add to headers
  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return config;
};

export const isCorporateUser = (state) => {
  const { corporateCarparks } = state.auth.user;
  return corporateCarparks !== undefined && corporateCarparks !== 0;
};

export const loadUser = () => async (dispatch, getState) => {
  // User loading
  dispatch({ type: USER_LOADING });

  const userConfig = tokenConfig(getState);

  if (!userConfig.headers['x-auth-token']) {
    return dispatch({ type: AUTH_ERROR });
  }

  return axios
    .get('/api/users', tokenConfig(getState))
    .then(res => parseUser(res.data))
    .then(parsedData => dispatch({ type: USER_LOADED, payload: parsedData }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: AUTH_ERROR });
    });
};

// Register User
export const registerUser = data => async dispatch =>
  axios
    .post('/api/users', data, config)
    .then(res => ({ ...res.data, user: parseUser(res.data.user) }))
    .then(parsedData => dispatch({ type: REGISTER_SUCCESS, payload: parsedData }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: REGISTER_FAIL });
      return Promise.reject(err.response.data.errors);
    });

// Update User
export const updateUser = data => async (dispatch, getState) =>
  axios
    .put('/api/users', data, tokenConfig(getState))
    .then(res => parseUser(res.data))
    .then(parsedData => dispatch({ type: UPDATE_USER, payload: parsedData }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      return Promise.reject(err.response.data.errors);
    });

// Login User
export const login = data => async dispatch =>
  axios
    .post('/api/auth', data, config)
    .then(res => ({ ...res.data, user: parseUser(res.data.user) }))
    .then(parsedData => dispatch({ type: LOGIN_SUCCESS, payload: parsedData }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: LOGIN_FAIL });
      return Promise.reject(err.response.data.errors);
    });

// Logout User
export const logout = () => ({ type: LOGOUT_SUCCESS });

// Update Password
export const updatePassword = data => async (dispatch, getState) =>
  axios
    .put('/api/users/password', data, tokenConfig(getState))
    .then(() => dispatch({ type: UPDATE_PASSWORD }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      return Promise.reject(err.response.data.errors);
    });

// Reset Password
export const resetPassword = data => async dispatch =>
  axios
    .put('/api/users/reset', data, config)
    .then(res => parseUser(res.data))
    .then(res => dispatch({ type: RESET_PASSWORD_SUCCESS, payload: res.data }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      return Promise.reject(err.response.data.errors);
    });

// Forgot Password
export const forgotPassword = data => async dispatch =>
  axios
    .post('/api/users/forgot', data, config)
    .then(() => dispatch({ type: FORGOT_PASSWORD }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      return Promise.reject(err.response.data.errors);
    });
