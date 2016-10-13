import User from './users';

describe('server.models.users', () => {
  it('should be a function', () => {
    expect(typeof User).toBe('function');
  });

  it('should have model validation', () => {
    const user = new User();
    const errors = user.validateSync();
    expect(errors.name).toEqual('ValidationError');
  });

  it('should set created', () => {
    const user = new User();
    expect(user.created).toBeTruthy();
  });

  describe('#setStars', () => {
    const user = new User();

    it('should be a function', () => {
      expect(typeof user.setStars).toBe('function');
    });

    it('should convert string array to object array', () => {
      const array = ['1', '2'];
      const response = user.setStars([], array);
      expect(response).toEqual([{
        repositoryId: '1', active: true,
      }, {
        repositoryId: '2', active: true,
      }]);
    });

    it('should return false for old star', () => {
      const array = ['1', '2'];
      const response = user.setStars([{ repositoryId: '2', active: false }], array);
      expect(response).toEqual([{
        repositoryId: '1', active: true,
      }, {
        repositoryId: '2', active: false,
      }]);
    });
  });
});
