import { GET_ERRORS, CLEAR_ERRORS, AUTH_ERROR } from './types';

// RETURN ERRORS
export const returnErrors = ({ data }, status, id = null) => {
  if (status === 401) {
    return { type: AUTH_ERROR };
  }

  return {
    type: GET_ERRORS,
    payload: {
      data,
      status,
      id,
    },
  };
};

// CLEAR GET_ERRORS
export const clearErrors = () => ({
  type: CLEAR_ERRORS,
});
