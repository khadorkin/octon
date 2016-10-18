import Cron from './index';

describe('server.cron.index', () => {
  it('should be a class', () => {
    expect(typeof Cron).toBe('function');
  });

  describe('#constructor', () => {
    const cron = new Cron();

    it('should set weeklyMail', () => {
      expect(cron.weeklyMail).toBeTruthy();
    });
  });

  describe('#start', () => {
    const cron = new Cron();

    it('should set checkForNewReleasesJob', () => {
      cron.start();
      cron.stop();
      expect(cron.checkForNewReleasesJob).toBeTruthy();
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

  describe('#stop', () => {
    const cron = new Cron();

    it('should cancel checkForNewReleasesJob', () => {
      cron.checkForNewReleasesJob = { cancel: jest.fn() };
      cron.weeklyMailJob = { cancel: jest.fn() };
      cron.stop();
      expect(cron.checkForNewReleasesJob.cancel.mock.calls.length).toEqual(1);
      expect(cron.weeklyMailJob.cancel.mock.calls.length).toEqual(1);
    });
  });
});
