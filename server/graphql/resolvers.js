import { Github } from 'node-social-api';
import Repository from '../models/repositories';

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

    repository(_, { type, name }, { user, Users }) {
      if (!user) {
        throw new Error('Must be logged in.');
      }
      return Users.getRepository(user, { type, name });
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

  Release: {
    description: (rel, _, { user }) => {
      if (rel.type !== 'release') {
        return null;
      }
      // TODO connector for model
      return Repository.findOne({ 'latestRelease._id': rel.id }).then((repository) => {
        if (!repository) throw new Error('Repository not found');
        const github = new Github({ accessToken: user.github.accessToken });
        return github.get(`repos/${repository.name}/releases`).then((releases) => {
          const release = releases[0];
          if (release && release.tag_name === repository.latestRelease.tagName) {
            return release.body;
          }
          return null;
        });
      });
    },
  },
};

export default resolvers;
