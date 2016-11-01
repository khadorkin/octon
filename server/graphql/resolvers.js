const resolvers = {
  Query: {
    currentUser(_, __, { user }) {
      if (!user) {
        throw new Error('Must be logged in.');
      }
      return user;
    },

    userRepositories(_, { page, search }, { user, Users }) {
      if (!user) {
        throw new Error('Must be logged in.');
      }
      return Users.getRepositories(user, page, search);
    },
  },

  Mutation: {
    syncUserGithubStars(_, __, { user, Users }) {
      if (!user) {
        throw new Error('Must be logged in.');
      }
      return Users.syncStars(user);
    },

    syncUserDockerStars(_, __, { user, Users }) {
      if (!user) {
        throw new Error('Must be logged in.');
      }
      return Users.syncDockerStars(user);
    },

    trackRepository(_, { repositoryId, active }, context) {
      if (!context.user) {
        throw new Error('Must be logged in.');
      }
      return context.Users.trackRepository(context.user, repositoryId, active);
    },

    setNotification(_, { type, active }, context) {
      if (!context.user) {
        throw new Error('Must be logged in.');
      }
      return context.Users.setNotification(context.user, type, active);
    },

    editUserEmail(_, { email }, { user, Users }) {
      if (!user) {
        throw new Error('Must be logged in.');
      }
      return Users.editEmail(user, email);
    },

    addDockerAccount(_, { username }, { user, Users }) {
      if (!user) {
        throw new Error('Must be logged in.');
      }
      return Users.addDockerAccount(user, username);
    },

    deleteUserAccount(_, __, { user, Users }) {
      if (!user) {
        throw new Error('Must be logged in.');
      }
      return Users.deleteAccount(user);
    },
  },

  User: {
    github: user => user.github,
    docker: user => user.docker,
  },

  Repository: {
    latestRelease: repo => repo.latestRelease,
    starred: (repository, __, context) =>
      context.Users.get(context.user.id).then((user) => {
        for (let i = 0; i < user.starred.length; i += 1) {
          const starred = user.starred[i];
          if (repository.id.toString() === starred.repositoryId.toString()) {
            return starred.active;
          }
        }
        return false;
      }),
  },
};

export default resolvers;
