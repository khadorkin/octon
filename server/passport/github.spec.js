import { connectDb, disconnectDb, dropDb } from '../core/tests';
import User from '../models/users';
import gitHubStrategy, { handleGithubReturn } from './github';

describe('server.passport.github', () => {
  describe('#gitHubStrategy', () => {
    it('should be a function', () => {
      expect(typeof gitHubStrategy).toBe('function');
    });

    it('should return strategy', () => {
      process.env.GITHUB_CLIENT_ID = 'toto';
      expect(gitHubStrategy()).toBeTruthy();
    });
  });

  describe('#handleGithubReturn', () => {
    beforeAll(async (done) => {
      await connectDb();
      done();
    });

    it('should be a function', () => {
      expect(typeof handleGithubReturn).toBe('function');
    });

    it('should save new user with github primary email', async () => {
      const callback = jest.fn();
      const profile = {
        id: 'id',
        username: 'username',
        photos: [{ value: 'photoValue' }],
        emails: [
          { value: 'no-primary', primary: false },
          { value: 'primary', primary: true },
        ],
      };
      await handleGithubReturn('accessToken', null, profile, callback);
      const user = await User.findOne({ _id: callback.mock.calls[0][1].id });
      expect(user).toBeTruthy();
      expect(callback.mock.calls.length).toEqual(1);
      expect(callback.mock.calls[0][0]).toEqual(null);
      expect(callback.mock.calls[0][1]).toBeTruthy();
    });

    it('should update user accessToken', async () => {
      const callback = jest.fn();
      await handleGithubReturn('accessToken2', null, { id: 'id' }, callback);
      const user = await User.findOne({ _id: callback.mock.calls[0][1].id });
      expect(user.github.accessToken).toEqual('accessToken2');
      expect(callback.mock.calls.length).toEqual(1);
      expect(callback.mock.calls[0][0]).toEqual(null);
      expect(callback.mock.calls[0][1]).toBeTruthy();
      expect(callback.mock.calls[0][1].github.accessToken).toEqual('accessToken2');
    });

    it('should return error', async () => {
      const callback = jest.fn();
      try {
        await handleGithubReturn(null, null, { id: 'toto' }, callback);
      } catch (err) {
        expect(callback.mock.calls.length).toEqual(1);
        expect(callback).toBeCalledWith(err);
      }
    });

    afterAll(async (done) => {
      await dropDb();
      disconnectDb(done);
    });
  });
});
