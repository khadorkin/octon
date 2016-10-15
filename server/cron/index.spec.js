import Cron from './index';

describe('server.cron.index', () => {
  it('should be a class', () => {
    expect(typeof Cron).toBe('function');
  });

  describe('#start', () => {
    const cron = new Cron();

    it('should ser checkForNewReleasesJob', () => {
      cron.start();
      expect(cron.checkForNewReleasesJob).toBeTruthy();
    });
  });

  describe('#stop', () => {
    const cron = new Cron();

    it('should cancel checkForNewReleasesJob', () => {
      const mock = jest.fn();
      cron.checkForNewReleasesJob = { cancel: mock };
      cron.stop();
      expect(mock.mock.calls.length).toEqual(1);
    });
  });
});
