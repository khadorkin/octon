import docker from 'docker-hub-api';

class Docker {
  getAllUserStars(username) {
    // TODO multiple pages
    return docker.repositoriesStarred(username);
  }

  makeReposirory(repo) {
    // TODO library organization images
    const ret = {
      name: `${repo.user}/${repo.name}`,
      htmlUrl: `https://hub.docker.com/r/${repo.user}/${repo.name}`,
      photo: `https://hub.docker.com/v2/users/${repo.user}/avatar/`,
      type: 'docker',
      refId: `${repo.user}/${repo.name}`,
    };
    return ret;
  }
}

export default Docker;
