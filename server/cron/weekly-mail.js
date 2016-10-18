import moment from 'moment';
import User from '../models/users';
import Repository from '../models/repositories';
import Email from '../emails';

class WeeklyMail {
  constructor() {
    this.email = new Email();
  }

  sendEmailNotification(user, repositories) {
    return this.email.weeklyUpdate(user, repositories);
  }

  start() {
    const startDate = moment().subtract(7, 'days');
    const endDate = moment();
    // Only return last 7 days updates
    return Repository.find({ 'latestRelease.publishedAt': {
      $gte: startDate, $lt: endDate,
    } }).sort({ 'latestRelease.publishedAt': -1, name: 1 }).exec().then((repositories) => {
      if (repositories.length === 0) return true;
      repositories = repositories.map((repository) => {
        repository.latestRelease.date = moment(repository.latestRelease.publishedAt).format('ddd DD MMM - h.mma');
        return repository;
      });
      const repositoriesIds = repositories.map(repo => repo.id);
      // Find users tracking repo
      return User.find({
        'starred.repositoryId': { $in: repositoriesIds },
        weeklyNotification: true,
      }).then((users) => {
        users.forEach((user) => {
          // For each users only return user tracking repos
          const userRepositories = repositories.filter((repository) => {
            for (let i = 0; i < user.starred.length; i += 1) {
              const star = user.starred[i];
              if (star.repositoryId.toString() === repository.id.toString() && star.active) {
                return true;
              }
            }
            return false;
          });
          this.sendEmailNotification(user, userRepositories);
        });
        return true;
      });
    });
  }
}

export default WeeklyMail;
