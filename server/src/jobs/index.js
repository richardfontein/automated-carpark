import schedule from 'node-schedule-tz';
import startTenancies from './startTenancies.job';
import endTenancies from './endTenancies.job';

// Works with Daylight Savings (uses moment.js in package)
schedule.scheduleJob('Start & End Tenancies', '0 0 * * *', 'Pacific/Auckland', () => {
  startTenancies();
  endTenancies();
});

export default schedule;
