import {
  GET_TENANCIES,
  ADD_TENANCY,
  UPDATE_TENANCY,
  DELETE_TENANCY,
  TENANCIES_LOADING,
} from '../actions/types';

const initialState = {
  tenancies: [],
  tenanciesLoading: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_TENANCIES:
      return { ...state, tenancies: action.payload, tenanciesLoading: false };
    case ADD_TENANCY:
      return { ...state, tenancies: [...state.tenancies, action.payload] };
    case UPDATE_TENANCY:
      return {
        ...state,
        tenancies: state.tenancies.map(tenancy =>
          (tenancy.id === action.payload.id ? action.payload : tenancy)),
      };
    case DELETE_TENANCY:
      return {
        ...state,
        tenancies: state.tenancies.filter(tenancy => tenancy.id !== action.payload),
      };
    case TENANCIES_LOADING:
      return { ...state, tenanciesLoading: true };
    default:
      return state;
  }
}
