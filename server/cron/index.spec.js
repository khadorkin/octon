import Cron from './index';

describe('server.cron.index', () => {
  it('should be a class', () => {
    expect(typeof Cron).toBe('function');
  });

  describe('#start', () => {
    const cron = new Cron();

    it('should set checkForNewReleasesJob', () => {
      cron.start();
      cron.stop();
      expect(cron.checkForNewReleasesJob).toBeTruthy();
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
