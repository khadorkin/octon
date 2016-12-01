import Docker from '../core/docker';
import Repository from '../models/repositories';

/**
 * @description Check for all new releases
 */
class CheckForNewReleases {
  /**
   * @description Start the task
   */
  start() {
    this.docker = new Docker();

    return Repository.find({ type: 'docker' }).sort({ type: 1 }).exec().then(repositories =>
      this.getLatestReleaseAndSave(repositories),
    );
  }

  getLatestReleaseAndSave(repositories) {
    if (repositories.length === 0) {
      return true;
    }
    const repository = repositories.pop();
    return this.docker.getLatestRelease(repository).then((release) => {
      if (repository.setLatestRelease(release)) {
        return repository.save();
      }
      return null;
    }).then(() => this.getLatestReleaseAndSave(repositories));
  }
}

export default CheckForNewReleases;
