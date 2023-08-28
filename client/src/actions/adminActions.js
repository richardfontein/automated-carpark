import axios from 'axios';
import {
  ADMIN_USERS_LOADED,
  ADMIN_USERS_LOADING,
  ADMIN_CREATE_USER,
  ADMIN_UPDATE_USER,
  ADMIN_INVOICES_LOADING,
  ADMIN_INVOICES_LOADED,
  ADMIN_INVOICES_LOADING_FAILED,
  ADMIN_CLEAR_INVOICES,
  ADMIN_XERO_CONTACTS_LOADING,
  ADMIN_XERO_CONTACTS_LOADED,
  ADMIN_CUSTOMER_LOADED,
  ADMIN_CUSTOMER_LOADING,
  ADMIN_CUSTOMER_LOADING_FAILED,
  ADMIN_TENANCIES_LOADED,
  ADMIN_TENANCIES_LOADING,
  ADMIN_UPDATE_TENANCY,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGIN_FAIL,
  ADMIN_LOGOUT_SUCCESS,
  ADMIN_AUTH_ERROR,
  ADMIN_LOADING,
  ADMIN_LOADED,
} from './types';
import { returnErrors } from './errorActions';

const config = { headers: { 'Content-Type': 'application/json' } };

const tokenConfig = (getState) => {
  // Get token from localStorage
  const { token } = getState().admin;

  // If token, add to headers
  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return config;
};

const parseUser = data => ({
  ...data,
  xeroContactId: data.xeroContactId || '',
  corporateCarparks: parseInt(data.corporateCarparks, 10),
});

const parseUsers = data => data.map(item => parseUser(item));

const composeUser = data => ({
  ...data,
  xeroContactId: data.xeroContactId || null,
  corporateCarparks: data.corporateCarparks ? parseInt(data.corporateCarparks, 10) : undefined,
});

// Login User
export const adminLogin = data => async dispatch =>
  axios
    .post('/api/admin/auth', data, config)
    .then(res => dispatch({ type: ADMIN_LOGIN_SUCCESS, payload: res.data }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: ADMIN_LOGIN_FAIL });
      return Promise.reject(err.response.data.errors);
    });

// Logout User
export const adminLogout = () => ({ type: ADMIN_LOGOUT_SUCCESS });

export const adminLoad = () => async (dispatch, getState) => {
  // User loading
  dispatch({ type: ADMIN_LOADING });

  const adminConfig = tokenConfig(getState);

  if (!adminConfig.headers['x-auth-token']) {
    return dispatch({ type: ADMIN_AUTH_ERROR });
  }

  return axios
    .get('/api/users', tokenConfig(getState))
    .then(res => dispatch({ type: ADMIN_LOADED, payload: res.data }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: ADMIN_AUTH_ERROR });
    });
};

export const getUsers = state => state.admin.users;

export const getUser = state => (id) => {
  const user = getUsers(state).find(foundUser => foundUser.id === id);

  if (!user) {
    return null;
  }

  return user;
};

export const getUserCount = state => getUsers(state).length;

export const getAdministrators = state =>
  state.admin.users.filter(user => user.role === 'administrator');

export const getAdministrator = state => (id) => {
  const user = getAdministrators(state).find(foundUser => foundUser.id === id);

  if (!user) {
    return null;
  }

  return user;
};

export const getAdministratorCount = state => getAdministrators(state).length;

export const adminGetUsers = () => async (dispatch, getState) => {
  dispatch({ type: ADMIN_USERS_LOADING });

  return axios
    .get('/api/admin/users', tokenConfig(getState))
    .then(res => parseUsers(res.data))
    .then(parsedData =>
      dispatch({
        type: ADMIN_USERS_LOADED,
        payload: parsedData,
      }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const adminCreateUser = data => async (dispatch, getState) => {
  const composedUser = composeUser(data);

  return axios
    .post('/api/admin/users', composedUser, tokenConfig(getState))
    .then(res => parseUser(res.data.user))
    .then(parsedData => dispatch({ type: ADMIN_CREATE_USER, payload: parsedData }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      return Promise.reject(err.response.data.errors);
    });
};

export const adminUpdateUser = data => async (dispatch, getState) => {
  const composedUser = composeUser(data);

  return axios
    .put('/api/admin/users', composedUser, tokenConfig(getState))
    .then(res => parseUser(res.data))
    .then(parsedData => dispatch({ type: ADMIN_UPDATE_USER, payload: parsedData }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      return Promise.reject(err.response.data.errors);
    });
};

export const adminLoadInvoices = (id, startingAfter) => async (dispatch, getState) => {
  // User loading
  dispatch({ type: ADMIN_INVOICES_LOADING });

  // Clear invoices and load from beginning if no start pointer specified
  if (!startingAfter) {
    dispatch({ type: ADMIN_CLEAR_INVOICES });
  }

  // Extract params from state
  const { limit } = getState().billing;

  // Create config
  const paramConfig = {
    params: { limit, startingAfter },
    ...tokenConfig(getState),
  };

  return axios
    .get(`/api/admin/invoices/${id}`, paramConfig)
    .then(res =>
      dispatch({
        type: ADMIN_INVOICES_LOADED,
        payload: res.data,
      }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: ADMIN_INVOICES_LOADING_FAILED,
      });
    });
};

export const adminGetXeroContacts = () => async (dispatch, getState) => {
  dispatch({ type: ADMIN_XERO_CONTACTS_LOADING });

  return axios
    .get('/api/admin/xeroContacts', tokenConfig(getState))
    .then(res =>
      dispatch({
        type: ADMIN_XERO_CONTACTS_LOADED,
        payload: res.data,
      }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const adminGetCustomer = id => async (dispatch, getState) => {
  dispatch({ type: ADMIN_CUSTOMER_LOADING });

  return axios
    .get(`/api/admin/customers/${id}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: ADMIN_CUSTOMER_LOADED,
        payload: res.data,
      }))
    .catch((err) => {
      dispatch({ type: ADMIN_CUSTOMER_LOADING_FAILED });
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// Parses dates in tenancy object
const parseTenancy = data => ({
  ...data,
  startDate: data.startDate ? new Date(data.startDate) : null,
  endDate: data.endDate ? new Date(data.endDate) : null,
});

const parseTenancies = data => data.map(item => parseTenancy(item));

export const getTenancyCount = state => state.admin.tenancies.length;

export const adminGetUserTenancies = state => userId =>
  state.admin.tenancies.filter(tenancy => tenancy.userId === userId);

export const adminGetAllTenancies = () => async (dispatch, getState) => {
  dispatch({ type: ADMIN_TENANCIES_LOADING });

  return axios
    .get('/api/admin/tenancies', tokenConfig(getState))
    .then(res => parseTenancies(res.data))
    .then(parsedData =>
      dispatch({
        type: ADMIN_TENANCIES_LOADED,
        payload: parsedData,
      }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const adminGetTenancy = state => (id) => {
  const tenancy = state.admin.tenancies.find(foundTenancy => foundTenancy.id === id);

  if (!tenancy) {
    return null;
  }

  return tenancy;
};

export const adminUpdateTenancy = item => async (dispatch, getState) =>
  axios
    .put(`/api/admin/tenancies/${item.id}`, item, tokenConfig(getState))
    .then(res => parseTenancy(res.data))
    .then(parsedData =>
      dispatch({
        type: ADMIN_UPDATE_TENANCY,
        payload: parsedData,
      }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      return Promise.reject(err.response.data.errors);
    });
