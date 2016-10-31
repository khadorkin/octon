import schedule from 'node-schedule';
import CheckForNewReleases from './check-for-new-releases';
import UpdateMail from './update-mail';
import logger from '../logger';

class Cron {
  constructor() {
    this.checkForNewReleases = new CheckForNewReleases();
    this.dailyMail = new UpdateMail('daily');
    this.weeklyMail = new UpdateMail('weekly');
  }

  start() {
    // Run each day at 12
    this.checkForNewReleasesJob = schedule.scheduleJob('0 12 * * *', () => this.startCheckForNewReleasesJob());
    // Run each day at 13
    this.dailyMailJob = schedule.scheduleJob('0 13 * * *', () => this.startDailyMail());
    // Run once a week every sunday
    this.weeklyMailJob = schedule.scheduleJob('0 13 * * 6', () => this.startWeeklyMail());
  }

  startCheckForNewReleasesJob() {
    logger.log('info', 'start checkForNewReleases');
    return this.checkForNewReleases.start()
      .then(() => logger.log('info', 'finish checkForNewReleases'))
      .catch(err => logger.log('error', err));
  }

  startDailyMail() {
    logger.log('info', 'start dailyMail');
    return this.dailyMail.start()
      .then(() => logger.log('info', 'finish dailyMail'))
      .catch(err => logger.log('error', err));
  }

  startWeeklyMail() {
    logger.log('info', 'start weeklyMail');
    return this.weeklyMail.start()
      .then(() => logger.log('info', 'finish weeklyMail'))
      .catch(err => logger.log('error', err));
  }

  stop() {
    this.checkForNewReleasesJob.cancel();
    this.dailyMailJob.cancel();
    this.weeklyMailJob.cancel();
  }
}

export default Cron;
