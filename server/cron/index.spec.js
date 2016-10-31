import Cron from './index';

describe('server.cron.index', () => {
  it('should be a class', () => {
    expect(typeof Cron).toBe('function');
  });

  describe('#constructor', () => {
    const cron = new Cron();

    it('should set cron jobs', () => {
      expect(cron.checkForNewReleases).toBeTruthy();
      expect(cron.dailyMail).toBeTruthy();
      expect(cron.weeklyMail).toBeTruthy();
    });
  });

  describe('#start', () => {
    const cron = new Cron();

    it('should set checkForNewReleasesJob', () => {
      cron.start();
      cron.stop();
      expect(cron.checkForNewReleasesJob).toBeTruthy();
      expect(cron.weeklyMailJob).toBeTruthy();
    });
  });

  describe('#startCheckForNewReleasesJob', () => {
    const cron = new Cron();

    it('should start checkForNewReleases job', async () => {
      cron.checkForNewReleases = { start: jest.fn() };
      cron.checkForNewReleases.start.mockReturnValue(Promise.resolve('sucess'));
      await cron.startCheckForNewReleasesJob();
      expect(cron.checkForNewReleases.start.mock.calls.length).toEqual(1);
    });

    it('should catch error', async () => {
      cron.checkForNewReleases = { start: jest.fn() };
      cron.checkForNewReleases.start.mockReturnValue(Promise.reject('error'));
      await cron.startCheckForNewReleasesJob();
      expect(cron.checkForNewReleases.start.mock.calls.length).toEqual(1);
    });
  });

  describe('#startWeeklyMail', () => {
    const cron = new Cron();

    it('should start weeklyMail job', async () => {
      cron.weeklyMail = { start: jest.fn() };
      cron.weeklyMail.start.mockReturnValue(Promise.resolve('sucess'));
      await cron.startWeeklyMail();
      expect(cron.weeklyMail.start.mock.calls.length).toEqual(1);
    });

    it('should catch error', async () => {
      cron.weeklyMail = { start: jest.fn() };
      cron.weeklyMail.start.mockReturnValue(Promise.reject('error'));
      await cron.startWeeklyMail();
      expect(cron.weeklyMail.start.mock.calls.length).toEqual(1);
    });
  });

  describe('#startDailyMail', () => {
    const cron = new Cron();

    it('should start dailyMail job', async () => {
      cron.dailyMail = { start: jest.fn() };
      cron.dailyMail.start.mockReturnValue(Promise.resolve('sucess'));
      await cron.startDailyMail();
      expect(cron.dailyMail.start.mock.calls.length).toEqual(1);
    });

    it('should catch error', async () => {
      cron.dailyMail = { start: jest.fn() };
      cron.dailyMail.start.mockReturnValue(Promise.reject('error'));
      await cron.startDailyMail();
      expect(cron.dailyMail.start.mock.calls.length).toEqual(1);
    });
  });

  describe('#stop', () => {
    const cron = new Cron();

    it('should cancel checkForNewReleasesJob', () => {
      cron.checkForNewReleasesJob = { cancel: jest.fn() };
      cron.dailyMailJob = { cancel: jest.fn() };
      cron.weeklyMailJob = { cancel: jest.fn() };
      cron.stop();
      expect(cron.checkForNewReleasesJob.cancel.mock.calls.length).toEqual(1);
      expect(cron.dailyMailJob.cancel.mock.calls.length).toEqual(1);
      expect(cron.weeklyMailJob.cancel.mock.calls.length).toEqual(1);
    });
  });
});
