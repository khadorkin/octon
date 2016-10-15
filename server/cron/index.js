import schedule from 'node-schedule';
import checkForNewReleases from './check-for-new-releases';
import logger from '../logger';

class Cron {
  constructor() {
    this.start();
  }

  start() {
    // Run once a day
    this.checkForNewReleasesJob = schedule.scheduleJob('0 12 * * *', () => {
      checkForNewReleases()
        .then(() => {
          logger.log('info', 'finish checkForNewReleases');
        })
        .catch((err) => {
          logger.log('error', err);
        });
    });
  }

  stop() {
    this.checkForNewReleasesJob.cancel();
  }
}

export default Cron;
