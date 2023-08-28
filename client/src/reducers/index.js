import { combineReducers } from 'redux';
import tenancyReducer from './tenancyReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import billingReducer from './billingReducer';
import adminReducer from './adminReducer';

export default combineReducers({
  tenancy: tenancyReducer,
  error: errorReducer,
  auth: authReducer,
  billing: billingReducer,
  admin: adminReducer,
});
