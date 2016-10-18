import {
  connectDb,
  disconnectDb,
  createUser,
  createRepository,
  createLatestRelease,
} from '../core/tests';
import { CheckForNewReleases } from './check-for-new-releases';

describe('server.cron.check-for-new-releases', () => {
  const repositories = [];
  const users = [];

  beforeAll(async (done) => {
    await connectDb();
    users.push(await createUser({ dailyNotification: true }));
    users.push(await createUser({ dailyNotification: true }));
    users.push(await createUser({ dailyNotification: true }));
    users.push(await createUser({ dailyNotification: false }));
    repositories.push(await createRepository());
    repositories[0].latestRelease = createLatestRelease();
    await repositories[0].save();
    users[0].starred.push({ repositoryId: repositories[0].id });
    users[1].starred.push({ repositoryId: repositories[0].id });
    users[2].starred.push({ repositoryId: repositories[0].id, active: false });
    users[3].starred.push({ repositoryId: repositories[0].id });
    await users[0].save();
    await users[1].save();
    await users[2].save();
    await users[3].save();
    done();
  });

  it('should be a class', () => {
    expect(typeof CheckForNewReleases).toBe('function');
  });

  describe('#constructor', () => {
    const checkForNewReleases = new CheckForNewReleases('toto');

    it('should set github and email', () => {
      expect(checkForNewReleases.github).toEqual('toto');
      expect(checkForNewReleases.email).toBeTruthy();
      expect(checkForNewReleases.email.newRelease).toBeTruthy();
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
  });

  afterAll(disconnectDb);
});
