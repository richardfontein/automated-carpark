import { convertTzDate, AUCKLAND_IANTZ_CODE, addMonths } from '../../../util/date';

const MIN_TERMINATION_MONTHS = 3;

export function sortArray(list, sortBy, defaultSortBy) {
  // eslint-disable-next-line consistent-return
  const comp = (_a, _b) => {
    const a = sortBy ? _a[sortBy] : _a;
    const b = sortBy ? _b[sortBy] : _b;

    // If both values are null, return using default sort key
    if (!a && !b) {
      return _a[defaultSortBy] - _b[defaultSortBy];
    }

    switch (typeof a) {
      case 'string':
        /* Sort so null strings are last */
        if (a === '') {
          return 1;
        }
        if (b === '') {
          return -1;
        }
        return a.localeCompare(b);

      case 'object':
        if (a instanceof Date) {
          if (a === null) {
            return 1;
          }
          if (b === null) {
            return -1;
          }
          return a.getTime() - b.getTime();
        }
        break;
      default:
        return _a[defaultSortBy] - _b[defaultSortBy];
    }
  };

  list.sort(comp);
}

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
