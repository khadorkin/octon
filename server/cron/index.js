import schedule from 'node-schedule';
import checkForNewReleases from './check-for-new-releases';
import WeeklyMail from './weekly-mail';
import logger from '../logger';

class Cron {
  start() {
    // Run once a day
    this.checkForNewReleasesJob = schedule.scheduleJob('0 12 * * *', this.startCheckForNewReleasesJob);
    // Run once a week every sunday
    this.weeklyMailJob = schedule.scheduleJob('0 13 * * 6', this.startWeeklyMail);
  }

  startCheckForNewReleasesJob() {
    return checkForNewReleases()
      .then(() => {
        logger.log('info', 'finish checkForNewReleases');
      })
      .catch((err) => {
        logger.log('error', err);
      });
  }

  startWeeklyMail() {
    const weeklyMail = new WeeklyMail();
    return weeklyMail.start()
      .then(() => {
        logger.log('info', 'finish checkForNewReleases');
      })
      .catch((err) => {
        logger.log('error', err);
      });
  }

  stop() {
    this.checkForNewReleasesJob.cancel();
    this.weeklyMailJob.cancel();
  }
}

export default Cron;
