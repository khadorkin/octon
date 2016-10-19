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

    describe('#trackRepository', () => {
      it('should throw if no user provided in context', () => {
        try {
          mutation.trackRepository(null, {}, {});
        } catch (err) {
          expect(err.message).toMatch(/logged/);
        }
      });

      it('should call Users.trackRepository', () => {
        const user = 'toto';
        const Users = { trackRepository: jest.fn() };
        const repositoryId = 'repositoryId';
        const active = true;
        mutation.trackRepository(null, { repositoryId, active }, { user, Users });
        expect(Users.trackRepository.mock.calls.length).toEqual(1);
        expect(Users.trackRepository).toBeCalledWith(user, repositoryId, active);
      });
    });

    describe('#setNotification', () => {
      it('should throw if no user provided in context', () => {
        try {
          mutation.setNotification(null, {}, {});
        } catch (err) {
          expect(err.message).toMatch(/logged/);
        }
      });

      it('should call Users.setNotification', () => {
        const user = 'toto';
        const Users = { setNotification: jest.fn() };
        const type = 'daily';
        const active = true;
        mutation.setNotification(null, { type, active }, { user, Users });
        expect(Users.setNotification.mock.calls.length).toEqual(1);
        expect(Users.setNotification).toBeCalledWith(user, type, active);
      });
    });

    describe('#deleteUserAccount', () => {
      it('should throw if no user provided in context', () => {
        try {
          mutation.deleteUserAccount(null, null, {});
        } catch (err) {
          expect(err.message).toMatch(/logged/);
        }
      });

      it('should call Users.deleteUserAccount', () => {
        const user = 'toto';
        const Users = { deleteAccount: jest.fn() };
        mutation.deleteUserAccount(null, null, { user, Users });
        expect(Users.deleteAccount.mock.calls.length).toEqual(1);
        expect(Users.deleteAccount).toBeCalledWith(user);
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

    describe('#starred', () => {
      it('should call context.Users.get', async () => {
        const arg = { id: 'id' };
        const context = {
          user: { id: 'id', starred: [{ repositoryId: 'id2', active: false }] },
        };
        context.Users = { get: jest.fn() };
        context.Users.get.mockReturnValue(Promise.resolve(context.user));
        const ret = await repository.starred(arg, null, context);
        expect(context.Users.get.mock.calls.length).toEqual(1);
        expect(ret).toEqual(false);
      });

      it('should return true', async () => {
        const arg = { id: 'id' };
        const context = {
          user: { id: 'id', starred: [{ repositoryId: 'id', active: true }] },
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
