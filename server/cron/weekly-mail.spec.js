import {
  connectDb,
  disconnectDb,
  createUser,
  createRepository,
  createLatestRelease,
} from '../core/tests';
import WeeklyMail from './weekly-mail';

describe('server.cron.weekly-mail', () => {
  const repositories = [];
  const users = [];

  beforeAll(async (done) => {
    await connectDb();
    users.push(await createUser({ weeklyNotification: true }));
    users.push(await createUser());
    repositories.push(await createRepository());
    repositories.push(await createRepository());
    repositories.push(await createRepository());
    repositories.push(await createRepository());
    done();
  });

  it('should be a class', () => {
    expect(typeof WeeklyMail).toBe('function');
  });

  describe('#constructor', () => {
    const weeklyEmail = new WeeklyMail();

    it('should set email', () => {
      expect(weeklyEmail.email).toBeTruthy();
      expect(weeklyEmail.email.weeklyUpdate).toBeTruthy();
    });
  });

  describe('#sendEmailNotification', () => {
    const weeklyEmail = new WeeklyMail();

    it('should call this.email.weeklyUpdate', () => {
      const mock = jest.fn();
      weeklyEmail.email = { weeklyUpdate: mock };
      weeklyEmail.sendEmailNotification('user', 'repositories');
      expect(mock.mock.calls.length).toEqual(1);
      expect(mock.mock.calls[0]).toEqual(['user', 'repositories']);
    });
  });

  describe('#start', () => {
    const weeklyEmail = new WeeklyMail();

    it('should return null', async () => {
      const ret = await weeklyEmail.start();
      expect(ret).toBeTruthy();
    });

    it('should return 2 of 3 releases repos for one user', async () => {
      // Assign 3 new releases
      // Make user tracking 2 of these releases
      repositories[0].latestRelease = createLatestRelease();
      await repositories[0].save();
      repositories[1].latestRelease = createLatestRelease();
      await repositories[1].save();
      repositories[2].latestRelease = createLatestRelease();
      await repositories[2].save();
      users[0].starred.push({ repositoryId: repositories[0].id });
      users[0].starred.push({ repositoryId: repositories[1].id });
      users[0].starred.push({ repositoryId: repositories[2].id, active: false });
      await users[0].save();
      weeklyEmail.sendEmailNotification = jest.fn();
      const ret = await weeklyEmail.start();
      expect(weeklyEmail.sendEmailNotification.mock.calls.length).toEqual(1);
      expect(weeklyEmail.sendEmailNotification.mock.calls[0][0].id).toEqual(users[0].id);
      expect(weeklyEmail.sendEmailNotification.mock.calls[0][1].length).toEqual(2);
      expect(weeklyEmail.sendEmailNotification.mock.calls[0][1][0].id).toEqual(repositories[1].id);
      expect(weeklyEmail.sendEmailNotification.mock.calls[0][1][1].id).toEqual(repositories[0].id);
      expect(ret).toBeTruthy();
    });
  });

  afterAll(disconnectDb);
});
