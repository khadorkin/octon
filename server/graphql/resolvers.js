const resolvers = {
  Query: {
    currentUser(_, __, { user }) {
      if (!user) {
        throw new Error('Must be logged in.');
      }
      return user;
    },
  },

  Mutation: {
    syncUserStars(_, __, { user, Users }) {
      if (!user) {
        throw new Error('Must be logged in.');
      }
      return Users.syncStars(user);
    },
  },
};

export default resolvers;
