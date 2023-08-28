import axios from 'axios';
import {
  CUSTOMER_LOADING,
  CUSTOMER_LOADED,
  CUSTOMER_LOADING_FAILED,
  INVOICES_LOADING,
  INVOICES_LOADED,
  INVOICES_LOADING_FAILED,
  CLEAR_INVOICES,
} from './types';
import { returnErrors } from './errorActions';
import { tokenConfig } from './authActions';
import { convertTzDate, AUCKLAND_IANTZ_CODE } from '../library/util/date';

export const loadCustomer = () => async (dispatch, getState) => {
  // Customer loading
  dispatch({ type: CUSTOMER_LOADING });

  return axios
    .get('/api/billing', tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: CUSTOMER_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: CUSTOMER_LOADING_FAILED,
      });
    });
};

export const addCard = item => async (dispatch, getState) =>
  axios
    .post('/api/billing/card', item, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: CUSTOMER_LOADED,
        payload: res.data,
      }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      return Promise.reject(err.response.data.errors);
    });

export const updateCard = item => async (dispatch, getState) =>
  axios
    .put('/api/billing/card', item, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: CUSTOMER_LOADED,
        payload: res.data,
      }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      return Promise.reject(err.response.data.errors);
    });

export const hasActiveCard = (state) => {
  const { sources = { data: [] } } = state.billing.customer;
  return sources.data.length !== 0;
};

export const getActiveCard = (state) => {
  const { sources = { data: [] } } = state.billing.customer;
  return sources.data[0] || null;
};

export const loadInvoices = startingAfter => async (dispatch, getState) => {
  // User loading
  dispatch({ type: INVOICES_LOADING });

  // Clear invoices and load from beginning if no start pointer specified
  if (!startingAfter) {
    dispatch({ type: CLEAR_INVOICES });
  }

  // Extract params from state
  const { limit } = getState().billing;

  // Create config
  const config = {
    params: { limit, startingAfter },
    ...tokenConfig(getState),
  };

  return axios
    .get('/api/billing/invoices', config)
    .then((res) => {
      dispatch({
        type: INVOICES_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: INVOICES_LOADING_FAILED,
      });
    });
};

export const getBillingCycleAnchor = (state) => {
  const { subscriptions } = state.billing.customer;
  const { tenancies } = state.tenancy;
  let billingCycleAnchor;

  if (subscriptions && subscriptions.data[0]) {
    billingCycleAnchor = convertTzDate(
      new Date(subscriptions.data[0].billing_cycle_anchor * 1000),
      AUCKLAND_IANTZ_CODE,
    );
  } else if (tenancies.length !== 0) {
    // Find the tenancy starting soonest and use that start date for the anchor
    billingCycleAnchor = tenancies.reduce(
      (min, tenancy) => (tenancy.startDate < min ? tenancy.startDate : min),
      tenancies[0].startDate,
    );
  } else {
    billingCycleAnchor = null;
  }

  return billingCycleAnchor;
};
