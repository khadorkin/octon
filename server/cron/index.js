import schedule from 'node-schedule';
import checkForNewReleases from './check-for-new-releases';
import logger from '../logger';

export default function () {
  // Run once a day
  schedule.scheduleJob('0 12 * * *', () => {
    checkForNewReleases()
      .then(() => {
        logger.log('info', 'finish checkForNewReleases');
      })
      .catch((err) => {
        logger.log('error', err);
      });
  });
}
