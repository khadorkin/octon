import GithubCore from './index';

describe('server.core.github', () => {
  it('should be a class', () => {
    expect(typeof GithubCore).toBe('function');
  });

  describe('#constructor', () => {
    const github = new GithubCore({ public: true });

    it('should set api', () => {
      expect(github.api).toBeTruthy();
    });
  });

  describe('#getAllUserRepositories', () => {
    const github = new GithubCore({ public: true });

    it('should call api', async () => {
      const mock = jest.fn();
      mock.mockReturnValue(Promise.resolve([]));
      github.api = { get: mock };
      const repo = await github.getAllUserRepositories();
      expect(mock.mock.calls.length).toEqual(1);
      expect(mock.mock.calls[0]).toEqual(['user/starred', { page: 1, per_page: 100 }]);
      expect(repo).toEqual([]);
    });

    it('should concat returns', async () => {
      const mock = jest.fn();
      const arr = new Array(100);
      mock.mockReturnValueOnce(Promise.resolve(arr));
      mock.mockReturnValueOnce(Promise.resolve([]));
      github.api = { get: mock };
      const repo = await github.getAllUserRepositories();
      expect(mock.mock.calls.length).toEqual(2);
      expect(mock.mock.calls[0]).toEqual(['user/starred', { page: 1, per_page: 100 }]);
      expect(mock.mock.calls[1]).toEqual(['user/starred', { page: 2, per_page: 100 }]);
      expect(repo).toEqual(arr);
    });
  });

  describe('#getLatestRelease', () => {
    const github = new GithubCore({ public: true });

    it('should return release', async () => {
      const repo = { fullName: 'facebook/react' };
      const release = await github.getLatestRelease(repo);
      expect(release).toBeTruthy();
      expect(release.type).toEqual('release');
    });

    it('should return tag', async () => {
      const repo = { fullName: 'egoist/hack' };
      const release = await github.getLatestRelease(repo);
      expect(release).toBeTruthy();
      expect(release.type).toEqual('tag');
    });

    it('should return null', async () => {
      const repo = { fullName: 'hustcc/timeago-react' };
      const release = await github.getLatestRelease(repo);
      expect(release).not.toBeTruthy();
    });
  });
});
