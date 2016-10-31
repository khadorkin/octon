import moment from 'moment';
import User from '../models/users';
import Repository from '../models/repositories';
import Email from '../emails';

class UpdateMail {
  constructor(type) {
    this.email = new Email();
    this.type = type;
  }

  sendEmailNotification(user, repositories) {
    if (this.type === 'daily') {
      return this.email.dailyUpdate(user, repositories);
    }
    return this.email.weeklyUpdate(user, repositories);
  }

  start() {
    let startDate;
    if (this.type === 'daily') {
      startDate = moment().subtract(1, 'days');
    } else {
      startDate = moment().subtract(7, 'days');
    }
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
      const query = {
        'starred.repositoryId': { $in: repositoriesIds },
      };
      if (this.type === 'daily') {
        query.dailyNotification = true;
      } else {
        query.weeklyNotification = true;
      }
      return User.find(query).then((users) => {
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

export default UpdateMail;
