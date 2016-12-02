import Github from '../core/github';
import Docker from '../core/docker';
import User from '../models/users';
import Repository from '../models/repositories';

/**
 * @description Check for all new releases
 */
class CheckForNewReleases {
  /**
   * @description Start the task
   */
  start() {
    return User.findOne().exec().then((user) => {
      if (!user) {
        throw new Error('No users');
      }
      this.github = new Github({ accessToken: user.github.accessToken });
      this.docker = new Docker();

      return Repository.find().sort({ type: 1 }).exec().then(repositories =>
        this.getLatestReleaseAndSave(repositories),
      );
    });
  }

  getLatestReleaseAndSave(repositories) {
    if (repositories.length === 0) {
      return true;
    }
    const repository = repositories.pop();
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
    }).then(() => this.getLatestReleaseAndSave(repositories));
  }
}

export default CheckForNewReleases;
