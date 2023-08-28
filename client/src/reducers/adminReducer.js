import {
  ADMIN_USERS_LOADED,
  ADMIN_USERS_LOADING,
  ADMIN_CREATE_USER,
  ADMIN_UPDATE_USER,
  ADMIN_DELETE_USER,
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
} from '../actions/types';

const initialState = {
  users: [],
  usersLoading: false,
  invoices: [],
  invoicesLoading: false,
  hasMore: false,
  limit: 10,
  xeroContacts: [],
  xeroContactsLoading: false,
  customer: {},
  customerLoading: false,
  tenancies: [],
  tenanciesLoading: false,
  admin: {},
  isAuthenticated: false,
  isLoading: true,
  token: localStorage.getItem('adminToken'),
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADMIN_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ADMIN_LOADED:
      return {
        ...state,
        admin: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case ADMIN_LOGIN_SUCCESS:
      localStorage.setItem('adminToken', action.payload.token);
      return {
        ...state,
        isLoading: false,
        token: action.payload.token,
        admin: action.payload.user,
        isAuthenticated: true,
      };
    case ADMIN_LOGOUT_SUCCESS:
    case ADMIN_LOGIN_FAIL:
    case ADMIN_AUTH_ERROR:
      localStorage.removeItem('adminToken');
      return {
        ...state,
        admin: initialState.admin,
        isLoading: false,
        token: null,
        isAuthenticated: false,
      };
    case ADMIN_USERS_LOADING:
      return { ...state, usersLoading: true };
    case ADMIN_USERS_LOADED:
      return { ...state, users: action.payload, usersLoading: false };
    case ADMIN_CREATE_USER:
      return { ...state, users: [...state.users, action.payload] };
    case ADMIN_UPDATE_USER:
      return {
        ...state,
        users: state.users.map(user => (user.id === action.payload.id ? action.payload : user)),
      };
    case ADMIN_DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
      };
    case ADMIN_INVOICES_LOADING:
      return {
        ...state,
        invoicesLoading: true,
      };
    case ADMIN_CLEAR_INVOICES:
      return {
        ...state,
        invoices: [],
        hasMore: false,
      };
    case ADMIN_INVOICES_LOADED:
      return {
        ...state,
        invoicesLoading: false,
        hasMore: action.payload.has_more,
        // concatenates previously loaded invoices
        invoices: [...state.invoices, ...action.payload.data],
      };
    case ADMIN_INVOICES_LOADING_FAILED:
      return {
        ...state,
        invoicesLoading: false,
        invoices: [],
        hasMore: false,
      };
    case ADMIN_XERO_CONTACTS_LOADING:
      return { ...state, xeroContactsLoading: true };
    case ADMIN_XERO_CONTACTS_LOADED:
      return { ...state, xeroContacts: action.payload, xeroContactsLoading: false };
    case ADMIN_CUSTOMER_LOADING:
      return { ...state, customerLoading: true };
    case ADMIN_CUSTOMER_LOADED:
      return { ...state, customer: action.payload, customerLoading: false };
    case ADMIN_CUSTOMER_LOADING_FAILED:
      return { ...state, customer: {}, customerLoading: false };
    case ADMIN_TENANCIES_LOADING:
      return { ...state, tenanciesLoading: true };
    case ADMIN_TENANCIES_LOADED:
      return { ...state, tenancies: action.payload, tenanciesLoading: false };
    case ADMIN_UPDATE_TENANCY:
      return {
        ...state,
        tenancies: state.tenancies.map(tenancy =>
          (tenancy.id === action.payload.id ? action.payload : tenancy)),
      };
    default:
      return state;
  }
}
