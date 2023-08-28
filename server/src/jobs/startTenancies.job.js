import { getAllTenancies, startTenancy } from '../services/tenancy.service';
import { convertTzDate, AUCKLAND_IANTZ_CODE } from '../util';
import logger from '../logger';

export default async () => {
  logger.info('Start tenancies job initiating...');

  let tenancies;
  try {
    tenancies = await getAllTenancies();
    tenancies = tenancies.get();
  } catch (e) {
    logger.error('StartTenancies could not be processed.\n', e);
  }

  const today = convertTzDate(new Date(), AUCKLAND_IANTZ_CODE).getTime();

  // eslint-disable-next-line no-restricted-syntax
  for (const tenancy of tenancies) {
    try {
      if (tenancy.startDate.getTime() === today && !tenancy.paid) {
        // eslint-disable-next-line no-await-in-loop
        await startTenancy(tenancy, 'allow_incomplete');
      }
    } catch (e) {
      logger.error(`Tenancy with id ${tenancy.id} could not be started.\n`, e);
    }
  }
};
