import axios from 'axios';
import {
  GET_TENANCIES,
  ADD_TENANCY,
  UPDATE_TENANCY,
  DELETE_TENANCY,
  TENANCIES_LOADING,
} from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

// Parses dates in tenancy object
const parseTenancy = data => ({
  ...data,
  startDate: data.startDate ? new Date(data.startDate) : null,
  endDate: data.endDate ? new Date(data.endDate) : null,
});

const parseTenancies = data => data.map(item => parseTenancy(item));

export const getTenancies = () => async (dispatch, getState) => {
  dispatch({ type: TENANCIES_LOADING });

  return axios
    .get('/api/tenancies', tokenConfig(getState))
    .then(res => parseTenancies(res.data))
    .then(parsedData =>
      dispatch({
        type: GET_TENANCIES,
        payload: parsedData,
      }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const getActiveTenancies = state =>
  state.tenancy.tenancies.filter(tenancy => !tenancy.subscriptionEnded);

export const getActiveTenanciesCount = state => getActiveTenancies(state).length;

export const getExpiredTenancies = state =>
  state.tenancy.tenancies.filter(tenancy => tenancy.subscriptionEnded);

export const getExpiredTenanciesCount = state => getExpiredTenancies(state).length;

export const getActiveTenancy = state => (id) => {
  const tenancy = getActiveTenancies(state).find(foundTenancy => foundTenancy.id === id);

  if (!tenancy) {
    return null;
  }

  return tenancy;
};

export const getExpiredTenancy = state => (id) => {
  const tenancy = getExpiredTenancies(state).find(foundTenancy => foundTenancy.id === id);

  if (!tenancy) {
    return null;
  }

  return tenancy;
};

export const addTenancy = item => async (dispatch, getState) =>
  axios
    .post('/api/tenancies', item, tokenConfig(getState))
    .then(res => parseTenancy(res.data))
    .then(parsedData =>
      dispatch({
        type: ADD_TENANCY,
        payload: parsedData,
      }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      return Promise.reject(err.response.data.errors);
    });

export const updateTenancy = item => async (dispatch, getState) =>
  axios
    .put(`/api/tenancies/${item.id}`, item, tokenConfig(getState))
    .then(res => parseTenancy(res.data))
    .then(parsedData =>
      dispatch({
        type: UPDATE_TENANCY,
        payload: parsedData,
      }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      return Promise.reject(err.response.data.errors);
    });

export const deleteTenancy = id => async (dispatch, getState) =>
  axios
    .delete(`/api/tenancies/${id}`, tokenConfig(getState))
    .then(() =>
      dispatch({
        type: DELETE_TENANCY,
        payload: id,
      }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      return Promise.reject(err.response.data.errors);
    });
