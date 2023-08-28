import { addMonths as dateFnsAddMonths, isValid } from 'date-fns';

export const AUCKLAND_IANTZ_CODE = 'Pacific/Auckland';

export const convertUTCDate = (date) => {
  if (date !== null) {
    const parsedDate = new Date(date);

    try {
      if (isValid(parsedDate)) {
        return new Date(
          Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()),
        );
      }
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const convertTzDate = (date, ianatz) => {
  if (date !== null) {
    return convertUTCDate(
      new Date(
        date.toLocaleString('en-US', {
          timeZone: ianatz,
        }),
      ),
    );
  }
  return null;
};

export const addMonths = (date, months) => convertTzDate(dateFnsAddMonths(date, months));
