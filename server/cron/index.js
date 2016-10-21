import schedule from 'node-schedule';
import CheckForNewReleases from './check-for-new-releases';
import WeeklyMail from './weekly-mail';
import logger from '../logger';

class Cron {
  constructor() {
    this.checkForNewReleases = new CheckForNewReleases();
    this.weeklyMail = new WeeklyMail();
  }

  start() {
    // Run each 6 hours
    this.checkForNewReleasesJob = schedule.scheduleJob('0 */6 * * *', this.startCheckForNewReleasesJob);
    // Run once a week every sunday
    this.weeklyMailJob = schedule.scheduleJob('0 13 * * 6', this.startWeeklyMail);
  }

  startCheckForNewReleasesJob() {
    return this.checkForNewReleases.start()
      .then(() => logger.log('info', 'finish checkForNewReleases'))
      .catch(err => logger.log('error', err));
  }

  startWeeklyMail() {
    return this.weeklyMail.start()
      .then(() => logger.log('info', 'finish checkForNewReleases'))
      .catch(err => logger.log('error', err));
  }

  stop() {
    this.checkForNewReleasesJob.cancel();
    this.weeklyMailJob.cancel();
  }
}

export default Cron;
