import { CheckForNewReleases } from './check-for-new-releases';

describe('server.cron.check-for-new-releases', () => {
  it('should be a class', () => {
    expect(typeof CheckForNewReleases).toBe('function');
  });

  describe('#constructor', () => {
    const checkForNewReleases = new CheckForNewReleases('toto');

    it('should set github and email', () => {
      expect(checkForNewReleases.github).toEqual('toto');
      expect(checkForNewReleases.email).toBeTruthy();
    });
  });

  describe('#sendEmailNotification', () => {
    const checkForNewReleases = new CheckForNewReleases();

    it('should call this.email.newRelease', () => {
      const mock = jest.fn();
      checkForNewReleases.email = { newRelease: mock };
      checkForNewReleases.sendEmailNotification('user', 'repository');
      expect(mock.mock.calls.length).toEqual(1);
      expect(mock.mock.calls[0]).toEqual(['user', 'repository']);
    });
  });

  describe('#getLatestReleaseAndSave', () => {
    const checkForNewReleases = new CheckForNewReleases();

    it('should return true for empty array', () => {
      const ret = checkForNewReleases.getLatestReleaseAndSave([]);
      expect(ret).toBeTruthy();
    });

    it('should return true if no realease found', async () => {
      checkForNewReleases.github = { getLatestRelease: jest.fn() };
      checkForNewReleases.github.getLatestRelease.mockReturnValue(Promise.resolve(null));
      const ret = await checkForNewReleases.getLatestReleaseAndSave(['repository']);
      expect(checkForNewReleases.github.getLatestRelease.mock.calls.length).toEqual(1);
      expect(ret).toBeTruthy();
    });

    it('should return true if same release id is found', async () => {
      checkForNewReleases.github = { getLatestRelease: jest.fn() };
      checkForNewReleases.github.getLatestRelease.mockReturnValue(Promise.resolve({ refId: 'refId' }));
      const ret = await checkForNewReleases.getLatestReleaseAndSave([{ latestRelease: { refId: 'refId' } }]);
      expect(checkForNewReleases.github.getLatestRelease.mock.calls.length).toEqual(1);
      expect(ret).toBeTruthy();
    });
  });
});
