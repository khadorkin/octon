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
});
