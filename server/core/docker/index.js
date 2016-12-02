import docker from 'docker-hub-api';
import semver from 'semver';

class Docker {
  /**
   * @param {string} username - Docker username of user
   * @description Return all docker stars of user
   * @return {array}
   */
  getAllUserStars(username) {
    // TODO multiple pages
    return docker.repositoriesStarred(username, {
      perPage: 100, page: 0,
    }).then((repositories) => {
      if (repositories.results) {
        return repositories.results;
      }
      return repositories;
    });
  }

  /**
   * @param {object} repo - Docker repository object
   * @description Format a docker repository to an object ready to be inserted in database
   * @return {object}
   */
  makeReposirory(repo) {
    // TODO library organization images
    const ret = {
      name: `${repo.user}/${repo.name}`,
      description: repo.description,
      htmlUrl: `https://hub.docker.com/r/${repo.user}/${repo.name}`,
      photo: `https://hub.docker.com/v2/users/${repo.user}/avatar/`,
      type: 'docker',
      refId: `${repo.user}/${repo.name}`,
    };
    return ret;
  }

  /**
   * @param {object} repository - Database repository object
   * @param {object} version - Docker tag object
   * @description Format a docker release to an object ready to be inserted in database
   * @return {object}
   */
  makeVersion(repository, version) {
    return {
      type: 'tag',
      refId: version.id,
      tagName: version.name,
      htmlUrl: `https://hub.docker.com/r/${repository.refId}/tags`,
      publishedAt: version.last_updated,
    };
  }

  /**
   * @param {object} repository - Database repository object
   * @description Return the latest release found on docker hub
   * @return {object}
   */
  getLatestRelease(repository) {
    const [username, name] = repository.refId.split('/');
    return docker.tags(username, name).then((tags) => {
      // If there is tags
      if (tags && tags.length > 0) {
        // Remove invalid semver versions
        const versions = tags.filter(v => semver.valid(v.name))
          // Sorts version by most recent
          .sort((v1, v2) => semver.compare(v2.name, v1.name));
        const version = versions[0];
        // If name is a valid tag try to find associated github release
        if (version && semver.valid(version.name)) {
          return this.makeVersion(repository, version);
        }
      }
      return null;
    });
  }
}

export default Docker;
