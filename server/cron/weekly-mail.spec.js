import { connectDb, disconnectDb } from '../core/tests';
import WeeklyMail from './weekly-mail';

describe('server.cron.weekly-mail', () => {
  beforeAll(async (done) => {
    await connectDb();
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
  });

  afterAll(disconnectDb);
});
