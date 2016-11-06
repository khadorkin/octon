import rp from 'request-promise';
import Server from './server';

describe('server.core.server', () => {
  it('should be a class', () => {
    expect(typeof Server).toBe('function');
  });

  describe('#start', () => {
    const server = new Server();

    it('should throw if connection with mongo failed', async () => {
      const tmpMongoEnv = process.env.MONGO_URL;
      process.env.MONGO_URL = 'toto';
      try {
        await server.start();
      } catch (err) {
        process.env.MONGO_URL = tmpMongoEnv;
        expect(err.name).toEqual('MongoError');
      }
    });

    it('should start express and mongo', async () => {
      await server.start();
      await server.stop();
      expect(server.app).toBeTruthy();
      expect(server.server).toBeTruthy();
    });
  });

  describe('express', () => {
    const server = new Server();

    beforeAll(async (done) => {
      await server.start();
      done();
    });

    it('should return home for non logged users', async () => {
      const ret = await rp('http://localhost:4000');
      expect(ret).toMatch(/Log in/);
    });

    it('should have logout route', async () => {
      const ret = await rp('http://localhost:4000/logout');
      expect(ret).toMatch(/Log in/);
    });

    afterAll(async (done) => {
      await server.stop();
      done();
    });
  });
});
