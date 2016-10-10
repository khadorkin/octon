import DataLoader from 'dataloader';
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
    const limit = 100;
    return this.get(userContext.id).then((user) => {
      if (!user) {
        throw new Error('No user found');
      }
      const starredIds = user.starred.map(data => data.githubId);
      return Repository.find({ 'github.id': { $in: starredIds } })
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
        return Repository.find({ 'github.id': { $in: githubRepositoriesIds } })
          .then((repositories) => {
            // Remove them to insert only new ones
            const repositoriesIds = repositories.map(repo => repo.github.id);
            const githubRepositoriesToInsert = githubRepositories.filter(repo =>
              repositoriesIds.indexOf(repo.id.toString()) === -1);
            // Insert new ones
            const promises = githubRepositoriesToInsert.map((repo) => {
              const newRepo = new Repository({
                name: repo.name,
                fullName: repo.full_name,
                htmlUrl: repo.html_url,
                photo: repo.owner.avatar_url,
                github: {
                  id: repo.id,
                },
              });
              return github.getLatestRelease(newRepo).then((latestRelease) => {
                if (latestRelease) {
                  newRepo.latestRelease = latestRelease;
                }
                return newRepo.save();
              });
            });
            return Promise.all(promises).then(() => {
              user.starred = user.setStars(user.starred, githubRepositoriesIds);
              user.lastSync = Date.now();
              return user.save();
            });
          });
      });
    });
  }
}

export default Users;
