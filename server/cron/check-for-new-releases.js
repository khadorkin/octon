import moment from 'moment';
import marked from 'marked';
import Github from '../core/github';
import Docker from '../core/docker';
import User from '../models/users';
import Repository from '../models/repositories';
import Email from '../emails';

class CheckForNewReleases {
  constructor() {
    this.email = new Email();
  }

  sendEmailNotification(user, repository) {
    return this.email.newRelease(user, repository);
  }

  start() {
    return User.findOne().exec().then((user) => {
      if (!user) {
        throw new Error('No users');
      }
      this.github = new Github({ accessToken: user.github.accessToken });
      this.docker = new Docker();

      return Repository.find().sort({ type: 1 }).exec().then(repositories =>
        this.getLatestReleaseAndSave(repositories)
      );
    });
  }

  findUsersTrackingRepo(repository, release) {
    return User.find({ 'starred.repositoryId': repository.id, dailyNotification: true }).exec().then((users) => {
      repository.latestRelease.date = moment(repository.latestRelease.publishedAt).format('ddd DD MMM - h.mma');
      repository.latestRelease.body = release.body ? marked(release.body) : null;
      users.forEach((user) => {
        let send = false;
        // Check if user have star.active
        user.starred.forEach((star) => {
          if (star.repositoryId.toString() === repository.id.toString() && star.active) {
            send = true;
          }
        });
        if (send) {
          // Send email to user
          this.sendEmailNotification(user, repository);
        }
      });
    });
  }

  getLatestReleaseAndSave(repositories) {
    if (repositories.length === 0) {
      return true;
    }
    const repository = repositories.pop();
    return this.getLatestRelease(repository).then((release) => {
      if (release) {
        // return this.findUsersTrackingRepo(repository, release);
      }
      return null;
    }).then(() => this.getLatestReleaseAndSave(repositories));
  }

  getLatestRelease(repository) {
    let promise;
    if (repository.type === 'github') {
      promise = this.github.getLatestRelease(repository);
    } else {
      promise = this.docker.getLatestRelease(repository);
    }
    return promise.then((release) => {
      // If there is no release or no new release
      if (!release ||
        (repository.latestRelease &&
        release.refId.toString() === repository.latestRelease.refId.toString())) {
        return null;
      }
      // If new release
      repository.latestRelease = release;
      return repository.save();
    });
  }
}

export default CheckForNewReleases;
