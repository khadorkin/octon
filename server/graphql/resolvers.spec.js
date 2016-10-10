import resolvers from './resolvers';

describe('server.graphql.resolvers', () => {
  it('should export resolvers', () => {
    expect(resolvers).toBeTruthy();
  });

  describe('#Query', () => {
    const query = resolvers.Query;

    describe('#currentUser', () => {
      it('should throw if no user provided in context', () => {
        try {
          query.currentUser(null, null, {});
        } catch (err) {
          expect(err.message).toMatch(/logged/);
        }
      });

      it('should return context user', () => {
        const user = 'toto';
        const ret = query.currentUser(null, null, { user });
        expect(user).toEqual(ret);
      });
    });

    describe('#userRepositories', () => {
      it('should throw if no user provided in context', () => {
        try {
          query.userRepositories(null, {}, {});
        } catch (err) {
          expect(err.message).toMatch(/logged/);
        }
      });

      it('should call Users.getRepositories', () => {
        const user = 'toto';
        const Users = { getRepositories: jest.fn() };
        query.userRepositories(null, { page: 'page' }, { user, Users });
        expect(Users.getRepositories.mock.calls.length).toEqual(1);
        expect(Users.getRepositories).toBeCalledWith(user, 'page');
      });
    });
  });

  describe('#Mutation', () => {
    const mutation = resolvers.Mutation;

    describe('#syncUserStars', () => {
      it('should throw if no user provided in context', () => {
        try {
          mutation.syncUserStars(null, null, {});
        } catch (err) {
          expect(err.message).toMatch(/logged/);
        }
      });

      it('should call Users.syncStars', () => {
        const user = 'toto';
        const Users = { syncStars: jest.fn() };
        mutation.syncUserStars(null, null, { user, Users });
        expect(Users.syncStars.mock.calls.length).toEqual(1);
        expect(Users.syncStars).toBeCalledWith(user);
      });
    });
  });

  describe('#Repository', () => {
    const repository = resolvers.Repository;

    describe('#latestRelease', () => {
      it('should return repository.latestRelease', () => {
        const arg = { latestRelease: { name: 'toto' } };
        const ret = repository.latestRelease(arg);
        expect(arg.latestRelease).toEqual(ret);
      });
    });

    describe('#githubId', () => {
      it('should return repository.github.id', () => {
        const arg = { github: { id: 'id' } };
        const ret = repository.githubId(arg);
        expect(arg.github.id).toEqual(ret);
      });
    });

    describe('#starred', () => {
      it('should call context.Users.get', async () => {
        const arg = { github: { id: 'id' } };
        const context = {
          user: { id: 'id', starred: [{ githubId: 'id2', active: false }] },
        };
        context.Users = { get: jest.fn() };
        context.Users.get.mockReturnValue(Promise.resolve(context.user));
        const ret = await repository.starred(arg, null, context);
        expect(context.Users.get.mock.calls.length).toEqual(1);
        expect(ret).toEqual(false);
      });

      it('should return true', async () => {
        const arg = { github: { id: 'id' } };
        const context = {
          user: { id: 'id', starred: [{ githubId: 'id', active: true }] },
        };
        context.Users = { get: jest.fn() };
        context.Users.get.mockReturnValue(Promise.resolve(context.user));
        const ret = await repository.starred(arg, null, context);
        expect(context.Users.get.mock.calls.length).toEqual(1);
        expect(ret).toEqual(true);
      });
    });
  });
});
