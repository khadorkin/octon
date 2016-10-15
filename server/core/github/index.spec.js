import GithubCore from './index';
import facebookReactTags from './test/facebook-react-tags.json';
import facebookReactReleases from './test/facebook-react-releases.json';
import egoistHackTags from './test/egoist-hack-tags.json';
import egoistHackReleases from './test/egoist-hack-releases.json';
import egoistHackCommit from './test/egoist-hack-commit.json';

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

    it('should return null', async () => {
      const repo = { name: 'hustcc/timeago-react' };
      const mock = jest.fn();
      mock.mockReturnValueOnce(Promise.resolve([]));
      github.api = { get: mock };
      const release = await github.getLatestRelease(repo);
      expect(mock.mock.calls.length).toEqual(1);
      expect(mock.mock.calls[0]).toEqual([`repos/${repo.name}/tags`]);
      expect(release).not.toBeTruthy();
    });

    it('should return release', async () => {
      const repo = { name: 'facebook/react' };
      const mock = jest.fn();
      mock.mockReturnValueOnce(Promise.resolve(facebookReactTags));
      mock.mockReturnValueOnce(Promise.resolve(facebookReactReleases));
      github.api = { get: mock };
      const release = await github.getLatestRelease(repo);
      expect(mock.mock.calls.length).toEqual(2);
      expect(mock.mock.calls[0]).toEqual([`repos/${repo.name}/tags`]);
      expect(mock.mock.calls[1]).toEqual([`repos/${repo.name}/releases`]);
      expect(release).toBeTruthy();
      expect(release.type).toEqual('release');
      expect(release.refId).toEqual(4171890);
      expect(release.tagName).toEqual('v15.3.2');
    });

    it('should return tag', async () => {
      const repo = { name: 'egoist/hack' };
      const mock = jest.fn();
      mock.mockReturnValueOnce(Promise.resolve(egoistHackTags));
      mock.mockReturnValueOnce(Promise.resolve(egoistHackReleases));
      mock.mockReturnValueOnce(Promise.resolve(egoistHackCommit));
      github.api = { get: mock };
      const release = await github.getLatestRelease(repo);
      expect(mock.mock.calls.length).toEqual(3);
      expect(mock.mock.calls[0]).toEqual([`repos/${repo.name}/tags`]);
      expect(mock.mock.calls[1]).toEqual([`repos/${repo.name}/releases`]);
      expect(mock.mock.calls[2]).toEqual([`repos/${repo.name}/commits/${egoistHackTags[0].commit.sha}`]);
      expect(release).toBeTruthy();
      expect(release.type).toEqual('tag');
      expect(release.refId).toEqual('7a8f0ea371809b094f9c3a32bedc8c609044e00d');
      expect(release.tagName).toEqual('v0.7.7');
    });
  });
});
