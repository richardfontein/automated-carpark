import {
  CUSTOMER_LOADING,
  CUSTOMER_LOADED,
  CUSTOMER_LOADING_FAILED,
  INVOICES_LOADING,
  INVOICES_LOADED,
  INVOICES_LOADING_FAILED,
  CLEAR_INVOICES,
} from '../actions/types';

const initialState = {
  customerLoading: true,
  customer: {},
  invoices: [],
  hasMore: false,
  invoicesLoading: true,
  limit: 10,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CUSTOMER_LOADING:
      return {
        ...state,
        customerLoading: true,
      };
    case CUSTOMER_LOADED:
      return {
        ...state,
        customerLoading: false,
        customer: action.payload,
      };
    case CUSTOMER_LOADING_FAILED:
      return {
        ...state,
        customerLoading: false,
        customer: {},
      };
    case INVOICES_LOADING:
      return {
        ...state,
        invoicesLoading: true,
      };
    case CLEAR_INVOICES:
      return {
        ...state,
        invoices: [],
        hasMore: false,
      };
    case INVOICES_LOADED:
      return {
        ...state,
        invoicesLoading: false,
        hasMore: action.payload.has_more,
        // concatenates previously loaded invoices
        invoices: [...state.invoices, ...action.payload.data],
      };
    case INVOICES_LOADING_FAILED:
      return {
        ...state,
        invoicesLoading: false,
        invoices: [],
        hasMore: false,
      };
    default:
      return state;
  }
}
