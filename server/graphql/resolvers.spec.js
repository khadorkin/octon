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
});
