import Email from './index';

describe('server.emails.index', () => {
  const user = {
    github: {
      email: 'email',
    },
  };
  const repository = {
    fullName: 'fullName',
    latestRelease: {
      tagName: 'tagName',
    },
  };

  it('should be a class', () => {
    expect(typeof Email).toBe('function');
  });

  describe('#constructor', () => {
    const email = new Email();

    it('should set transporter', () => {
      expect(email.transporter).toBeTruthy();
    });
  });

  describe('#constructEmail', () => {
    const email = new Email();

    it('should be a function', () => {
      expect(typeof email.constructEmail).toBe('function');
    });

    it('should return compiled template', () => {
      const template = email.constructEmail('new-release');
      expect(template).toBeTruthy();
    });
  });

  describe('#sendMail', () => {
    const email = new Email();

    it('should be a function', () => {
      expect(typeof email.sendMail).toBe('function');
    });

    it('should call transporter.sendMail', async () => {
      email.transporter = {
        sendMail: jest.fn((data, cb) => cb(null, true)),
      };
      await email.sendMail({
        to: 'to', subject: 'subject', html: 'html',
      });
      expect(email.transporter.sendMail.mock.calls.length).toEqual(1);
    });

    it('should resolve promise', async () => {
      email.transporter = {
        sendMail: jest.fn((data, cb) => cb(null, true)),
      };
      const res = await email.sendMail({
        to: 'to', subject: 'subject', html: 'html',
      });
      expect(email.transporter.sendMail.mock.calls.length).toEqual(1);
      expect(res).toEqual(true);
    });

    it('should reject promise', async () => {
      email.transporter = {
        sendMail: jest.fn((data, cb) => cb('error')),
      };
      try {
        await email.sendMail({
          to: 'to', subject: 'subject', html: 'html',
        });
      } catch (err) {
        expect(email.transporter.sendMail.mock.calls.length).toEqual(1);
        expect(err).toEqual('error');
      }
    });
  });

  describe('#newRelease', () => {
    const email = new Email();

    it('should be a function', () => {
      expect(typeof email.newRelease).toBe('function');
    });

    it('should call sendMail', () => {
      email.sendMail = jest.fn();
      email.newRelease(user, repository);
      expect(email.sendMail.mock.calls.length).toEqual(1);
    });
  });

  describe('#weeklyUpdate', () => {
    const email = new Email();

    it('should be a function', () => {
      expect(typeof email.weeklyUpdate).toBe('function');
    });

    it('should call sendMail', () => {
      email.sendMail = jest.fn();
      email.weeklyUpdate(user, []);
      expect(email.sendMail.mock.calls.length).toEqual(1);
    });
  });
});
