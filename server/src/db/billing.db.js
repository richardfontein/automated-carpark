import Plan from './models/Plan';
import { RetrievedResource } from '../status/successCodes';

// eslint-disable-next-line import/prefer-default-export
export const getPlans = () =>
  Plan.findAll().then(plans => new RetrievedResource(plans.map(plan => plan.get())));
