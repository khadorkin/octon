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
        query.userRepositories(null, { page: 'page', search: 'search' }, { user, Users });
        expect(Users.getRepositories.mock.calls.length).toEqual(1);
        expect(Users.getRepositories).toBeCalledWith(user, 'page', 'search');
      });
    });
  });

  describe('#Mutation', () => {
    const mutation = resolvers.Mutation;

    describe('#syncUserGithubStars', () => {
      it('should throw if no user provided in context', () => {
        try {
          mutation.syncUserGithubStars(null, null, {});
        } catch (err) {
          expect(err.message).toMatch(/logged/);
        }
      });

      it('should call Users.syncStars', () => {
        const user = 'toto';
        const Users = { syncStars: jest.fn() };
        mutation.syncUserGithubStars(null, null, { user, Users });
        expect(Users.syncStars.mock.calls.length).toEqual(1);
        expect(Users.syncStars).toBeCalledWith(user);
      });
    });

    describe('#syncUserDockerStars', () => {
      it('should throw if no user provided in context', () => {
        try {
          mutation.syncUserDockerStars(null, null, {});
        } catch (err) {
          expect(err.message).toMatch(/logged/);
        }
      });

      it('should call Users.syncStars', () => {
        const user = 'toto';
        const Users = { syncDockerStars: jest.fn() };
        mutation.syncUserDockerStars(null, null, { user, Users });
        expect(Users.syncDockerStars.mock.calls.length).toEqual(1);
        expect(Users.syncDockerStars).toBeCalledWith(user);
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

    describe('#editUserEmail', () => {
      it('should throw if no user provided in context', () => {
        try {
          mutation.editUserEmail(null, {}, {});
        } catch (err) {
          expect(err.message).toMatch(/logged/);
        }
      });

      it('should call Users.editEmail', () => {
        const user = 'toto';
        const Users = { editEmail: jest.fn() };
        mutation.editUserEmail(null, { email: 'email' }, { user, Users });
        expect(Users.editEmail.mock.calls.length).toEqual(1);
        expect(Users.editEmail).toBeCalledWith(user, 'email');
      });
    });

    describe('#addDockerAccount', () => {
      it('should throw if no user provided in context', () => {
        try {
          mutation.addDockerAccount(null, {}, {});
        } catch (err) {
          expect(err.message).toMatch(/logged/);
        }
      });

      it('should call Users.addDockerAccount', () => {
        const user = 'toto';
        const Users = { addDockerAccount: jest.fn() };
        mutation.addDockerAccount(null, { username: 'username' }, { user, Users });
        expect(Users.addDockerAccount.mock.calls.length).toEqual(1);
        expect(Users.addDockerAccount).toBeCalledWith(user, 'username');
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

      it('should call Users.deleteAccount', () => {
        const user = 'toto';
        const Users = { deleteAccount: jest.fn() };
        mutation.deleteUserAccount(null, null, { user, Users });
        expect(Users.deleteAccount.mock.calls.length).toEqual(1);
        expect(Users.deleteAccount).toBeCalledWith(user);
      });
    });
  });

  describe('#User', () => {
    const user = resolvers.User;

    describe('#github', () => {
      it('should return user.github', () => {
        const arg = { github: { username: 'toto' } };
        const ret = user.github(arg);
        expect(arg.github).toEqual(ret);
      });
    });

    describe('#docker', () => {
      it('should return user.docker', () => {
        const arg = { docker: { username: 'toto' } };
        const ret = user.docker(arg);
        expect(arg.docker).toEqual(ret);
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
