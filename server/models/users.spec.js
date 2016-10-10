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
});
