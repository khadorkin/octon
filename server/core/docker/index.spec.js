import DockerCore from './index';

describe('server.core.docker', () => {
  it('should be a class', () => {
    expect(typeof DockerCore).toBe('function');
  });

  describe('#makeReposirory', () => {
    const docker = new DockerCore();

    it('should make repository', () => {
      const rethinkdb = {
        user: 'library',
        name: 'rethinkdb',
        namespace: 'library',
        status: 1,
        description: 'RethinkDB is an open-source, document database that makes it easy to build and scale realtime apps.',
        is_private: false,
        is_automated: false,
        can_edit: false,
        star_count: 332,
        pull_count: 4494483,
        last_updated: '2016-10-22T02:25:33.733025Z',
      };
      const repo = docker.makeReposirory(rethinkdb);
      expect(repo).toEqual({
        name: 'library/rethinkdb',
        htmlUrl: 'https://hub.docker.com/r/library/rethinkdb',
        photo: 'https://hub.docker.com/v2/users/library/avatar/',
        type: 'docker',
        refId: 'library/rethinkdb',
      });
    });
  });
});
