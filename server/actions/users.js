import DataLoader from 'dataloader';
import validator from 'validator';
import dockerApi from 'docker-hub-api';
import Github from '../core/github';
import Docker from '../core/docker';
import User from '../models/users';
import Repository from '../models/repositories';

class Users {
  constructor() {
    this.userLoader = new DataLoader(ids =>
      Promise.all(ids.map(id => User.findOne({ _id: id }).exec()))
    );
  }

  get(id) {
    return this.userLoader.load(id);
  }

  getRepositories(userContext, page = 1, search) {
    const limit = 50;
    return this.get(userContext.id).then((user) => {
      if (!user) {
        throw new Error('No user found');
      }
      const repositoriesIds = user.starred.map(data => data.repositoryId);
      const query = { _id: { $in: repositoriesIds } };
      if (search && search.length >= 1) {
        query.name = new RegExp(search);
      }
      return Repository.find(query)
        .sort({ 'latestRelease.publishedAt': -1, name: 1 })
        .skip(limit * (page - 1)).limit(limit)
        .exec();
    });
  }

  syncStars(userContext) {
    return this.get(userContext.id).then((user) => {
      if (!user) {
        throw new Error('No user found');
      }
      // Check if user have already sync stars 1 hour before
      if (user.github.lastSync) {
        let date = new Date();
        date = new Date(date.getTime() - (60 * 60000));
        if (date < user.github.lastSync) {
          throw new Error('You already have sync your stars less than 1 hour before');
        }
      }

      const github = new Github({ accessToken: user.github.accessToken });

      // TODO limit to last 1000 repositories ?
      return github.getAllUserRepositories().then((githubRepositories) => {
        const githubRepositoriesIds = githubRepositories.map(repo => repo.id);
        // Find all repo already in database
        return Repository.find({ refId: { $in: githubRepositoriesIds }, type: 'github' })
          .then((repositories) => {
            // Remove them to insert only new ones
            let repositoriesIds = repositories.map(repo => repo.refId);
            const githubRepositoriesToInsert = githubRepositories.filter(repo =>
              repositoriesIds.indexOf(repo.id.toString()) === -1);
            // Insert new ones
            const promises = githubRepositoriesToInsert.map((repo) => {
              const newRepo = new Repository({
                name: repo.full_name,
                htmlUrl: repo.html_url,
                photo: repo.owner.avatar_url,
                type: 'github',
                refId: repo.id,
              });
              return github.getLatestRelease(newRepo).then((latestRelease) => {
                if (latestRelease) {
                  newRepo.latestRelease = latestRelease;
                }
                return newRepo.save();
              });
            });
            return Promise.all(promises).then((data) => {
              repositoriesIds = repositories.concat(data).map(repo => repo.id);
              user.starred = user.setStars(user.starred, repositoriesIds, 'github');
              user.github.lastSync = Date.now();
              return user.save();
            });
          });
      });
    });
  }

  syncDockerStars(userContext) {
    return this.get(userContext.id).then((user) => {
      if (!user) {
        throw new Error('No user found');
      }
      if (!user.docker) {
        throw new Error('You must configure a docker account before');
      }
      // Check if user have already sync stars 1 hour before
      if (user.docker.lastSync) {
        let date = new Date();
        date = new Date(date.getTime() - (60 * 60000));
        if (date < user.docker.lastSync) {
          throw new Error('You already have sync your stars less than 1 hour before');
        }
      }
      const docker = new Docker();
      return docker.getAllUserStars(user.docker.username).then((dockerRepositories) => {
        const dockerRepositoriesIds = dockerRepositories.map(repo => `${repo.user}/${repo.name}`);
        return Repository.find({ refId: { $in: dockerRepositoriesIds }, type: 'github' })
          .then((repositories) => {
            let repositoriesIds = repositories.map(repo => repo.refId);
            const dockerRepositoriesToInsert = dockerRepositories.filter(repo =>
              repositoriesIds.indexOf(`${repo.user}/${repo.name}`) === -1);
            const promises = dockerRepositoriesToInsert.map((repo) => {
              const newRepo = new Repository(docker.makeReposirory(repo));
              return newRepo.save();
            });
            return Promise.all(promises).then((data) => {
              repositoriesIds = repositories.concat(data).map(repo => repo.id);
              user.starred = user.setStars(user.starred, repositoriesIds, 'docker');
              user.docker.lastSync = Date.now();
              return user.save();
            });
          });
      });
    });
  }

  trackRepository(userContext, repositoryId, active) {
    return this.get(userContext.id).then((user) => {
      if (!user) {
        throw new Error('No user found');
      }
      user.starred = user.starred.map((star) => {
        if (star.repositoryId.toString() === repositoryId) {
          star.active = active;
        }
        return star;
      });
      // Save user and return respository
      return user.save().then(() =>
        Repository.findOne({ _id: repositoryId }).exec());
    });
  }

  setNotification(userContext, type, active) {
    return this.get(userContext.id).then((user) => {
      if (!user) {
        throw new Error('No user found');
      }
      if (type === 'daily') {
        user.dailyNotification = active;
      } else if (type === 'weekly') {
        user.weeklyNotification = active;
      } else {
        throw new Error('Invalid type');
      }
      // Save user and return respository
      return user.save();
    });
  }

  editEmail(userContext, email) {
    return this.get(userContext.id).then((user) => {
      if (!user) {
        throw new Error('No user found');
      }
      if (!validator.isEmail(email)) {
        throw new Error('Invalid email');
      }
      user.email = email;
      return user.save();
    });
  }

  addDockerAccount(userContext, username) {
    return this.get(userContext.id).then((user) => {
      if (!user) {
        throw new Error('No user found');
      }
      return dockerApi.user(username)
        .then((res) => {
          if (res === 'Not Found') {
            throw new Error('User not found on docker hub');
          }
          if (res.type !== 'User') {
            throw new Error('Not a valid docker user');
          }
          user.docker = {
            id: res.id,
            username: res.username,
          };
          return user.save();
        });
    });
  }

  deleteAccount(userContext) {
    return this.get(userContext.id).then((user) => {
      if (!user) {
        throw new Error('No user found');
      }
      return user.remove();
    });
  }
}

export default Users;
