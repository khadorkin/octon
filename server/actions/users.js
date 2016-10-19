import DataLoader from 'dataloader';
import validator from 'validator';
import Github from '../core/github';
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

  getRepositories(userContext, page = 1) {
    const limit = 50;
    return this.get(userContext.id).then((user) => {
      if (!user) {
        throw new Error('No user found');
      }
      const repositoriesIds = user.starred.map(data => data.repositoryId);
      return Repository.find({ _id: { $in: repositoriesIds } })
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
      if (user.lastSync) {
        let date = new Date();
        date = new Date(date.getTime() - (60 * 60000));
        if (date < user.lastSync) {
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
              user.starred = user.setStars(user.starred, repositoriesIds);
              user.lastSync = Date.now();
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
