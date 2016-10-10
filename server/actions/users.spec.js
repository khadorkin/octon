import { connectDb, disconnectDb, createUser } from '../core/tests';
import Users from './users';

describe('server.actions.users', () => {
  let user;

  beforeAll(async (done) => {
    await connectDb();
    user = await createUser();
    done();
  });

  it('should be a class', () => {
    expect(typeof Users).toBe('function');
  });

  describe('#constructor', () => {
    const users = new Users();

    it('should set userLoader', () => {
      expect(users.userLoader).toBeTruthy();
    });
  });

  describe('#get', () => {
    const users = new Users();

    it('should not get user', async () => {
      const ret = await users.get('507f1f77bcf86cd799439011');
      expect(ret).not.toBeTruthy();
    });

    it('should get user', async () => {
      const ret = await users.get(user.id);
      expect(ret).toBeTruthy();
    });
  });

  describe('#syncStars', () => {
    it('should throw with not found user', async () => {
      const users = new Users();
      try {
        await users.syncStars({ id: '507f1f77bcf86cd799439011' });
      } catch (err) {
        expect(err.message).toEqual('No user found');
      }
    });

    it('should throw if user already have synced hi', async () => {
      const users = new Users();
      user.lastSync = Date.now();
      await user.save();
      try {
        await users.syncStars({ id: user.id });
      } catch (err) {
        user.lastSync = null;
        await user.save();
        expect(err.message).toEqual('You already have sync your stars less than 1 hour before');
      }
    });

    it('should call github core api', async () => {
      const users = new Users();
      try {
        await users.syncStars({ id: user.id });
      } catch (err) {
        expect(err.body.message).toEqual('Bad credentials');
      }
    });
  });

  afterAll(disconnectDb);
});
