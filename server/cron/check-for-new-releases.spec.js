import {
  connectDb,
  disconnectDb,
  createUser,
  createRepository,
  createLatestRelease,
} from '../core/tests';
import CheckForNewReleases from './check-for-new-releases';

describe('server.cron.check-for-new-releases', () => {
  const repositories = [];
  const users = [];

  beforeAll(async (done) => {
    await connectDb();
    repositories.push(await createRepository());
    repositories[0].latestRelease = createLatestRelease();
    await repositories[0].save();
    done();
  });

  it('should be a class', () => {
    expect(typeof CheckForNewReleases).toBe('function');
  });

  describe('#start', () => {
    const checkForNewReleases = new CheckForNewReleases('toto');

    it('should throw if no users in database', async () => {
      checkForNewReleases.getLatestReleaseAndSave = jest.fn();
      try {
        await checkForNewReleases.start();
      } catch (err) {
        expect(err.message).toEqual('No users');
        expect(checkForNewReleases.getLatestReleaseAndSave.mock.calls.length).toEqual(0);

        // Save user for the next tests
        users.push(await createUser({ dailyNotification: true }));
        await users[0].save();
      }
    });

    it('should call getLatestReleaseAndSave with repositories', async () => {
      checkForNewReleases.getLatestReleaseAndSave = jest.fn();
      await checkForNewReleases.start();
      expect(checkForNewReleases.getLatestReleaseAndSave.mock.calls.length).toEqual(1);
      expect(checkForNewReleases.getLatestReleaseAndSave.mock.calls[0].length).toEqual(1);
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
      const ret = await checkForNewReleases.getLatestReleaseAndSave([repositories[0]]);
      expect(checkForNewReleases.github.getLatestRelease.mock.calls.length).toEqual(1);
      expect(ret).toBeTruthy();
    });

    it('should return true if same release id is found', async () => {
      repositories[0].latestRelease = createLatestRelease();
      await repositories[0].save();
      checkForNewReleases.github = { getLatestRelease: jest.fn() };
      checkForNewReleases.github.getLatestRelease
        .mockReturnValue(Promise.resolve({ refId: repositories[0].latestRelease.refId }));
      const ret = await checkForNewReleases.getLatestReleaseAndSave([repositories[0]]);
      expect(checkForNewReleases.github.getLatestRelease.mock.calls.length).toEqual(1);
      expect(ret).toBeTruthy();
    });

    it('should save repo with new latestRelease', async () => {
      const latestRelease = createLatestRelease();
      checkForNewReleases.github = { getLatestRelease: jest.fn() };
      checkForNewReleases.findUsersTrackingRepo = jest.fn();
      checkForNewReleases.github.getLatestRelease.mockReturnValue(Promise.resolve(latestRelease));
      const ret = await checkForNewReleases.getLatestReleaseAndSave([repositories[0]]);
      expect(checkForNewReleases.github.getLatestRelease.mock.calls.length).toEqual(1);
      expect(ret).toBeTruthy();
    });
  });

  afterAll(disconnectDb);
});
