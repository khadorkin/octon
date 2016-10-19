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

  describe('#constructor', () => {
    const checkForNewReleases = new CheckForNewReleases('toto');

    it('should set email', () => {
      expect(checkForNewReleases.email).toBeTruthy();
      expect(checkForNewReleases.email.newRelease).toBeTruthy();
    });
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

        // Save users for the next tests
        users.push(await createUser({ dailyNotification: true }));
        users.push(await createUser({ dailyNotification: true }));
        users.push(await createUser({ dailyNotification: true }));
        users.push(await createUser({ dailyNotification: false }));
        users[0].starred.push({ repositoryId: repositories[0].id });
        users[1].starred.push({ repositoryId: repositories[0].id });
        users[2].starred.push({ repositoryId: repositories[0].id, active: false });
        users[3].starred.push({ repositoryId: repositories[0].id });
        await users[0].save();
        await users[1].save();
        await users[2].save();
        await users[3].save();
      }
    });

    it('should call getLatestReleaseAndSave with repositories', async () => {
      checkForNewReleases.getLatestReleaseAndSave = jest.fn();
      await checkForNewReleases.start();
      expect(checkForNewReleases.getLatestReleaseAndSave.mock.calls.length).toEqual(1);
      expect(checkForNewReleases.getLatestReleaseAndSave.mock.calls[0].length).toEqual(1);
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

  describe('#findUsersTrackingRepo', () => {
    const checkForNewReleases = new CheckForNewReleases();

    it('should call findUsersTrackingRepo for 2 users', async () => {
      checkForNewReleases.sendEmailNotification = jest.fn();
      await checkForNewReleases.findUsersTrackingRepo(repositories[0],
        repositories[0].latestRelease);
      expect(checkForNewReleases.sendEmailNotification.mock.calls.length).toEqual(2);
      expect(checkForNewReleases.sendEmailNotification.mock.calls[0][1].id)
        .toEqual(repositories[0].id);
    });

    it('should call marked on body', async () => {
      checkForNewReleases.sendEmailNotification = jest.fn();
      repositories[0].latestRelease.body = '# toto';
      await checkForNewReleases.findUsersTrackingRepo(repositories[0],
        repositories[0].latestRelease);
      expect(checkForNewReleases.sendEmailNotification.mock.calls.length).toEqual(2);
      expect(checkForNewReleases.sendEmailNotification.mock.calls[0][1].id)
        .toEqual(repositories[0].id);
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

    it('should save repo with new latestRelease', async () => {
      const latestRelease = createLatestRelease();
      checkForNewReleases.github = { getLatestRelease: jest.fn() };
      checkForNewReleases.findUsersTrackingRepo = jest.fn();
      checkForNewReleases.github.getLatestRelease.mockReturnValue(Promise.resolve(latestRelease));
      const ret = await checkForNewReleases.getLatestReleaseAndSave([repositories[0]]);
      expect(checkForNewReleases.github.getLatestRelease.mock.calls.length).toEqual(1);
      expect(checkForNewReleases.findUsersTrackingRepo.mock.calls.length).toEqual(1);
      expect(ret).toBeTruthy();
    });
  });

  afterAll(disconnectDb);
});
