import {
  connectDb,
  disconnectDb,
  createUser,
  createRepository,
  createLatestRelease,
} from '../core/tests';
import UpdateMail from './update-mail';

describe('server.cron.update-mail', () => {
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
    expect(typeof UpdateMail).toBe('function');
  });

  describe('#constructor', () => {
    const updateEmail = new UpdateMail('daily');

    it('should set email', () => {
      expect(updateEmail.email).toBeTruthy();
      expect(updateEmail.email.weeklyUpdate).toBeTruthy();
    });

    it('should set type', () => {
      expect(updateEmail.type).toEqual('daily');
    });
  });

  describe('#sendEmailNotification', () => {
    it('should call this.email.dailyUpdate', () => {
      const updateEmail = new UpdateMail('daily');
      const mock = jest.fn();
      updateEmail.email = { dailyUpdate: mock };
      updateEmail.sendEmailNotification('user', 'repositories');
      expect(mock.mock.calls.length).toEqual(1);
      expect(mock.mock.calls[0]).toEqual(['user', 'repositories']);
    });

    it('should call this.email.weeklyUpdate', () => {
      const updateEmail = new UpdateMail('weekly');
      const mock = jest.fn();
      updateEmail.email = { weeklyUpdate: mock };
      updateEmail.sendEmailNotification('user', 'repositories');
      expect(mock.mock.calls.length).toEqual(1);
      expect(mock.mock.calls[0]).toEqual(['user', 'repositories']);
    });
  });

  describe('#start', () => {
    const updateEmail = new UpdateMail('weekly');

    it('should return null', async () => {
      const ret = await updateEmail.start();
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
      users[0].starred.push({ repositoryId: repositories[0].id, type: 'github' });
      users[0].starred.push({ repositoryId: repositories[1].id, type: 'github' });
      users[0].starred.push({ repositoryId: repositories[2].id, active: false, type: 'github' });
      await users[0].save();
      updateEmail.sendEmailNotification = jest.fn();
      const ret = await updateEmail.start();
      expect(updateEmail.sendEmailNotification.mock.calls.length).toEqual(1);
      expect(updateEmail.sendEmailNotification.mock.calls[0][0].id).toEqual(users[0].id);
      expect(updateEmail.sendEmailNotification.mock.calls[0][1].length).toEqual(2);
      expect(updateEmail.sendEmailNotification.mock.calls[0][1][0].id).toEqual(repositories[1].id);
      expect(updateEmail.sendEmailNotification.mock.calls[0][1][1].id).toEqual(repositories[0].id);
      expect(ret).toBeTruthy();
    });
  });

  afterAll(disconnectDb);
});
