import { connectDb, disconnectDb, createUser } from '../core/tests';
import UsersModel from '../models/users';
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

  describe('#getRepositories', () => {
    const users = new Users();

    it('should throw with not found user', async () => {
      try {
        await users.getRepositories({ id: '507f1f77bcf86cd799439011' });
      } catch (err) {
        expect(err.message).toEqual('No user found');
      }
    });

    it('should return repositories', async () => {
      const ret = await users.getRepositories({ id: user.id });
      expect(ret).toEqual([]);
    });

    it('should search with regex', async () => {
      const ret = await users.getRepositories({ id: user.id }, 1, 'a');
      expect(ret).toEqual([]);
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
      user.github.lastSync = Date.now();
      await user.save();
      try {
        await users.syncStars({ id: user.id });
      } catch (err) {
        user.github.lastSync = null;
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

  describe('#trackRepository', () => {
    const users = new Users();

    it('should throw with not found user', async () => {
      try {
        await users.trackRepository({ id: '507f1f77bcf86cd799439011' });
      } catch (err) {
        expect(err.message).toEqual('No user found');
      }
    });

    it('should set starred repo to false', async () => {
      await users.trackRepository({ id: user.id }, user.starred[1].repositoryId.toString(), false);
      const ret = await UsersModel.findOne({ _id: user.id }).exec();
      expect(ret.starred[1].active).toEqual(false);
    });
  });

  describe('#setNotification', () => {
    const users = new Users();

    it('should throw with not found user', async () => {
      try {
        await users.setNotification({ id: '507f1f77bcf86cd799439011' });
      } catch (err) {
        expect(err.message).toEqual('No user found');
      }
    });

    it('should throw with invalid type', async () => {
      try {
        await users.setNotification({ id: user.id }, 'type');
      } catch (err) {
        expect(err.message).toEqual('Invalid type');
      }
    });

    it('should set dailyNotification to false', async () => {
      await users.setNotification({ id: user.id }, 'daily', false);
      const ret = await UsersModel.findOne({ _id: user.id }).exec();
      expect(ret.dailyNotification).toEqual(false);
    });

    it('should set weeklyNotification to true', async () => {
      await users.setNotification({ id: user.id }, 'weekly', true);
      const ret = await UsersModel.findOne({ _id: user.id }).exec();
      expect(ret.weeklyNotification).toEqual(true);
    });
  });

  describe('#editEmail', () => {
    const users = new Users();

    it('should throw with not found user', async () => {
      try {
        await users.editEmail({ id: '507f1f77bcf86cd799439011' });
      } catch (err) {
        expect(err.message).toEqual('No user found');
      }
    });

    it('should throw with invalid email', async () => {
      try {
        await users.editEmail({ id: user.id }, 'email');
      } catch (err) {
        expect(err.message).toEqual('Invalid email');
      }
    });

    it('should delete user in database', async () => {
      const email = 'toto@toto.com';
      const ret = await users.editEmail({ id: user.id }, email);
      const retUser = await UsersModel.findOne({ _id: user.id }).exec();
      expect(ret).toBeTruthy();
      expect(ret.email).toEqual(email);
      expect(retUser.email).toEqual(email);
    });
  });

  describe('#deleteAccount', () => {
    const users = new Users();

    it('should throw with not found user', async () => {
      try {
        await users.deleteAccount({ id: '507f1f77bcf86cd799439011' });
      } catch (err) {
        expect(err.message).toEqual('No user found');
      }
    });

    it('should delete user in database', async () => {
      const ret = await users.deleteAccount({ id: user.id });
      const retUser = await UsersModel.findOne({ _id: user.id }).exec();
      expect(ret).toBeTruthy();
      expect(retUser).not.toBeTruthy();
    });
  });

  afterAll(disconnectDb);
});
