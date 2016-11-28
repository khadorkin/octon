import schedule from 'node-schedule';
import CheckForNewReleases from './check-for-new-releases';
import UpdateMail from './update-mail';
import SyncUserStars from './sync-user-stars';
import logger from '../logger';

class Cron {
  constructor() {
    this.checkForNewReleases = new CheckForNewReleases();
    this.dailyMail = new UpdateMail('daily');
    this.weeklyMail = new UpdateMail('weekly');
    this.syncUserStars = new SyncUserStars();
  }

  start() {
    // Run each 2 hours
    this.checkForNewReleasesJob = schedule.scheduleJob('0 */2 * * *', () => this.startCheckForNewReleasesJob());
    // Run each day at 13
    this.dailyMailJob = schedule.scheduleJob('0 13 * * *', () => this.startDailyMail());
    // Run once a week every sunday
    this.weeklyMailJob = schedule.scheduleJob('0 13 * * 6', () => this.startWeeklyMail());
    // Run each day at 20
    this.syncUserStarsJob = schedule.scheduleJob('0 20 * * *', () => this.startSyncUserStars());
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

  startSyncUserStars() {
    logger.log('info', 'start syncUserStars');
    return this.syncUserStars.start()
      .then(() => logger.log('info', 'finish syncUserStars'))
      .catch(err => logger.log('error', err));
  }

  stop() {
    this.checkForNewReleasesJob.cancel();
    this.dailyMailJob.cancel();
    this.weeklyMailJob.cancel();
    this.syncUserStarsJob.cancel();
  }
}

export default Cron;
