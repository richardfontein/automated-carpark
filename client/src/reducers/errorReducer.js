import { GET_ERRORS, CLEAR_ERRORS } from '../actions/types';

const initialState = {
  data: null,
  status: null,
  id: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        data: action.payload.data,
        status: action.payload.status,
        id: action.payload.id,
      };
    case CLEAR_ERRORS:
      return {
        data: null,
        status: null,
        id: null,
      };
    default:
      return state;
  }
}
