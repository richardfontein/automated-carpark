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
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  user: {
    firstName: '',
    lastName: '',
    email: '',
    company: '',
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
    case UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
    case RESET_PASSWORD_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: initialState.user,
        isAuthenticated: false,
        isLoading: false,
      };
    case UPDATE_PASSWORD:
    case FORGOT_PASSWORD:
      return state;
    default:
      return state;
  }
}
