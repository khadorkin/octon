import { connectDb, disconnectDb } from '../core/tests';
import { serializeUser, deserializeUser } from './passport';

describe('server.passport.passport', () => {
  describe('#serializeUser', () => {
    it('should be a function', () => {
      expect(typeof serializeUser).toBe('function');
    });

    it('should pass user.id to callback', () => {
      const callback = jest.fn();
      serializeUser({ id: 'id' }, callback);
      expect(callback.mock.calls.length).toEqual(1);
      expect(callback).toBeCalledWith(null, 'id');
    });
  });

  describe('#serializeUser', () => {
    beforeAll(async (done) => {
      await connectDb();
      done();
    });

    it('should be a function', () => {
      expect(typeof deserializeUser).toBe('function');
    });

    it('should return user', async () => {
      const callback = jest.fn();
      await deserializeUser(null, callback);
      expect(callback.mock.calls.length).toEqual(1);
      expect(callback).toBeCalledWith(null, null);
    });

    it('should return error', async () => {
      const callback = jest.fn();
      try {
        await deserializeUser('id', callback);
      } catch (err) {
        expect(callback.mock.calls.length).toEqual(1);
        expect(callback).toBeCalledWith(err);
      }
    });

    afterAll(disconnectDb);
  });
});
