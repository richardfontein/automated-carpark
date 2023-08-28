import * as Yup from 'yup';

import { getMinimumEndDate } from './util';
import { convertTzDate, AUCKLAND_IANTZ_CODE } from '../../../util/date';

const plateSchema = Yup.object().shape({
  registration: Yup.string()
    .uppercase()
    .matches(/^[a-zA-Z0-9 ]{1,6}$/, 'Registration plate must contain only letters and numbers')
    .min(1, 'Minimum length is 1 character')
    .max(6, 'Maximum length is 6 characters')
    .required('A registration plate is required'),
});

// eslint-disable-next-line import/prefer-default-export
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
    .transform(value => convertTzDate(value), AUCKLAND_IANTZ_CODE)
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
        convertTzDate(new Date()),
        'Start date must be today or later',
        AUCKLAND_IANTZ_CODE,
      ),
    }),
  endDate: Yup.date()
    .transform(value => convertTzDate(value), AUCKLAND_IANTZ_CODE)
    .nullable()
    .test({
      name: 'minimumEndDate',
      message: 'Minimum termination period is 3 months, please select a later date',
      test(endDate) {
        const values = this.parent;
        const initialValues = this.options.context;

        const { startDate } = values;

        // test is only run when start date and end date are specified
        if (startDate && endDate) {
          return endDate >= getMinimumEndDate(values, initialValues);
        }

        return true;
      },
    }),
});
