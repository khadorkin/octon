import { Github } from 'node-social-api';
import semver from 'semver';
import Repository from '../../models/repositories';

class GithubCore {
  constructor(options) {
    this.api = new Github(options);
  }

  /**
   * @param {object} repo - Github repository object
   * @description Format a github repository to an object ready to be inserted in database
   * @return {object}
   */
  formatReposirory(repo) {
    return {
      name: repo.full_name,
      description: repo.description,
      htmlUrl: repo.html_url,
      photo: repo.owner.avatar_url,
      type: 'github',
      refId: repo.id,
    };
  }

  getAllUserRepositories(page = 1, repositories = []) {
    const perPage = 100;
    // Get max repo per page
    return this.api.get('user/starred', {
      page,
      per_page: perPage,
    }).then((data) => {
      const repos = [...repositories, ...data];
      // If max repo length returned fetch next page
      // && limit to 1000 last stars
      if (data.length === perPage && page <= 10) {
        const newPage = page + 1;
        return this.getAllUserRepositories(newPage, repos);
      }
      return repos;
    });
  }

  getLatestRelease(repo) {
    return this.api.get(`repos/${repo.name}/tags`).then((data) => {
      // If there is tags
      if (data && data.length > 0) {
        // Remove invalid semver versions
        let versions = data.filter(v => semver.valid(v.name));
        // Sorts version by most recent
        versions = versions.sort((v1, v2) => semver.compare(v2.name, v1.name));
        // Take only latest version
        const version = versions[0];
        // If name is a valid tag try to find associated github release
        if (version && semver.valid(version.name)) {
          return this.getReleaseObject(repo, version);
        }
      }
      return null;
    });
  }

  getReleaseObject(repo, version) {
    // Find latest github release
    return this.api.get(`repos/${repo.name}/releases`)
      .then((releases) => {
        const release = releases[0];
        // If there is a release and the name is the same than tag
        if (release && release.tag_name === version.name) {
          // Create latest release object
          const latestRelease = {
            type: 'release',
            refId: release.id,
            tagName: release.tag_name,
            htmlUrl: release.html_url,
            publishedAt: release.published_at,
          };
          return latestRelease;
        }
        // Return infos about commit
        return this.api.get(`repos/${repo.name}/commits/${version.commit.sha}`)
          .then((commit) => {
            // Create latest release object
            const latestRelease = {
              type: 'tag',
              refId: commit.sha,
              tagName: version.name,
              htmlUrl: `https://github.com/${repo.name}/releases`,
              publishedAt: commit.commit.committer.date,
            };
            return latestRelease;
          });
      });
  }

  /**
   * @param {object} repo - Github repository object
   * @description Create a new github repository in database
   * @return {promise}
   */
  createRepository(repo) {
    const newRepo = new Repository(this.formatReposirory(repo));
    return this.getLatestRelease(newRepo).then((latestRelease) => {
      if (latestRelease) {
        newRepo.latestRelease = latestRelease;
      }
      return newRepo.save();
    });
  }
}

export default GithubCore;
