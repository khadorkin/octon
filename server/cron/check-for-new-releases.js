import moment from 'moment';
import marked from 'marked';
import Github from '../core/github';
import User from '../models/users';
import Repository from '../models/repositories';
import Email from '../emails';

class CheckForNewReleases {
  constructor(github) {
    this.github = github;
    this.email = new Email();
  }

  sendEmailNotification(user, repository) {
    return this.email.newRelease(user, repository);
  }

  findUsersTrackingRepo(repository, release) {
    return User.find({ 'starred.githubId': repository.github.id }).exec().then((users) => {
      repository.latestRelease.date = moment(repository.latestRelease.publishedAt).format('ddd DD MMM - h.mma');
      repository.latestRelease.body = release.body ? marked(release.body) : null;
      users.forEach((user) => {
        let send = false;
        // Check if user have star.active
        user.starred.forEach((star) => {
          if (star.githubId === repository.github.id && star.active) {
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
    return this.github.getLatestRelease(repository).then((release) => {
      // If there is no release or no new release
      if (!release ||
        (repository.latestRelease &&
        release.githubId.toString() === repository.latestRelease.githubId.toString())) {
        return null;
      }
      // If new release
      repository.latestRelease = release;
      return repository.save().then(() =>
        // Find wich user is tracking repository
        this.findUsersTrackingRepo(repository, release)
      );
    }).then(() => this.getLatestReleaseAndSave(repositories));
  }
}

export default function () {
  return User.findOne().exec().then((user) => {
    if (!user) {
      throw new Error('No users');
    }
    const github = new Github({ accessToken: user.github.accessToken });
    const checkForNewReleases = new CheckForNewReleases(github);

    return Repository.find().exec().then(repositories =>
      checkForNewReleases.getLatestReleaseAndSave(repositories)
    );
  });
}
