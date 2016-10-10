import Repository from './repositories';

describe('server.models.repositories', () => {
  it('should be a function', () => {
    expect(typeof Repository).toBe('function');
  });

  it('should have model validation', () => {
    const repository = new Repository();
    const errors = repository.validateSync();
    expect(errors.name).toEqual('ValidationError');
  });

  it('should set created', () => {
    const repository = new Repository();
    expect(repository.created).toBeTruthy();
  });
});
