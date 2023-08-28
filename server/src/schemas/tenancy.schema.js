import * as Yup from 'yup';

import { convertTzDate, AUCKLAND_IANTZ_CODE, addMonths } from '../util';

const plateSchema = Yup.object().shape({
  registration: Yup.string()
    .uppercase()
    .matches(/^[a-zA-Z0-9 ]{1,6}$/, 'Registration plate must contain only letters and numbers')
    .min(1, 'Minimum length is 1 character')
    .max(6, 'Maximum length is 6 characters')
    .required('A registration plate is required'),
});

export const MIN_TERMINATION_MONTHS = 3;

export const getMinimumEndDate = (values = {}, initialValues = {}) => {
  const { startDate } = values;
  const { endDate: initialEndDate } = initialValues;

  const today = convertTzDate(new Date(), AUCKLAND_IANTZ_CODE);
  const todayPlusTermination = addMonths(today, MIN_TERMINATION_MONTHS);
  const startPlusTermination = addMonths(startDate, MIN_TERMINATION_MONTHS);
  let minimumEndDate;

  // When initial end date is specified
  if (initialEndDate) {
    // Minimum end date is 3 months from start date, 3 months from today,
    // or initial end date, whichever is sooner
    if (startDate > today) {
      minimumEndDate = startPlusTermination;
    } else if (initialEndDate > todayPlusTermination) {
      minimumEndDate = todayPlusTermination;
    } else {
      minimumEndDate = initialEndDate;
    }
  } else if (startDate > today) {
    // When no initial end date is specified:
    // Minimum end date is 3 months from today or 3 months from start date,
    // whichever is further
    minimumEndDate = startPlusTermination;
  } else {
    minimumEndDate = todayPlusTermination;
  }

  return minimumEndDate;
};

export const tenancySchema = Yup.object().shape({
  id: Yup.number()
    .integer()
    .positive(),
  vehicleType: Yup.string().required('Vehicle type is required'),
  plates: Yup.array(plateSchema)
    // At least one plate must be provided when vehicleType is not Bicycle
    .when('vehicleType', (vehicleType, schema) =>
      (vehicleType !== 'Bicycle'
        ? schema
            .required('Registration plate is required')
            .min(1, 'Registration plate is required')
            .max(2, 'No more than 2 plates allowed')
        : schema)),
  nickname: Yup.string().max(40, 'Maximum length is 40 characters'),
  startDate: Yup.date()
    .transform(value => convertTzDate(value, AUCKLAND_IANTZ_CODE))
    .required('Start date is required')
    .nullable()
    .when(['$subscriptionStarted', '$subscriptionEnded'], {
      // If subscription is in progress
      is: (subscriptionStarted, subscriptionEnded) => subscriptionStarted && !subscriptionEnded,
      then: Yup.date()
        // Start date cannot be changed
        // the `$` references initial start date passed through context
        .min(Yup.ref('$startDate'), 'Start date cannot be changed while tenancy is in progress')
        .max(Yup.ref('$startDate'), 'Start date cannot be changed while tenancy is in progress'),
      otherwise: Yup.date().min(
        convertTzDate(new Date(), AUCKLAND_IANTZ_CODE),
        'Start date must be today or later',
      ),
    }),
  endDate: Yup.date()
    .transform(value => convertTzDate(value, AUCKLAND_IANTZ_CODE))
    .nullable()
    .test({
      name: 'minimumEndDate',
      message: 'Minimum termination period is 3 months, please select a later date',
      test(endDate) {
        const values = this.parent;
        const initialValues = this.options.context;

        if (this.options.context.role === 'administrator') {
          return true;
        }

        const { startDate } = values;

        // test is only run when start date and end date are specified
        if (startDate && endDate) {
          return endDate >= getMinimumEndDate(values, initialValues);
        }

        return true;
      },
    }),
});
