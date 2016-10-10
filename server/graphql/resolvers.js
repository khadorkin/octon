const resolvers = {
  Query: {
    currentUser(_, __, { user }) {
      if (!user) {
        throw new Error('Must be logged in.');
      }
      return user;
    },
  },
};

export default resolvers;
