import FeedSub from 'feed-sub';
import User from '../models/users';
import Repository from '../models/repositories';
import Github from './github';
import logger from '../logger';

class Stream {
  start() {
    this.feed = new FeedSub([], {
      // 1 hour
      interval: 60 * 60 * 2,
    });
    this.feed.on('update', this.updateFeed);
    this.feed.on('error', this.handleError);
    // Return all urls to track
    this.feed.getUrls(() =>
      Repository.find({ type: 'github' }).exec().then(repositories =>
        repositories.map(repo => `https://github.com/${repo.name}/tags.atom`),
      ),
    );
    this.feed.start();
  }

  stop() {
    this.feed.stop();
  }

  updateFeed(feed) {
    // If no items in feed skip
    // When there is no tags github return the updated date has changed
    if (feed.items.length > 0) {
      let name = feed.link[0].href.split('/');
      name = `${name[1]}/${name[2]}`;
      Repository.findOne({ type: 'github', name }).exec().then((repository) => {
        if (!repository) {
          throw new Error('Repository not found');
        }
        return User.findOne().exec().then((user) => {
          if (!user) {
            throw new Error('No users');
          }
          const github = new Github({ accessToken: user.github.accessToken });
          return github.getLatestRelease(repository);
        }).then((release) => {
          if (repository.setLatestRelease(release)) {
            return repository.save();
          }
          return null;
        });
      }).catch((err) => {
        logger.log('error', err);
      });
    }
  }

  handleError(err) {
    logger.log('error', err);
  }
}

export default Stream;
