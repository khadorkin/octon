import moment from 'moment';
import User from '../models/users';
import Users from '../actions/users';

class SyncUserStars {
  start() {
    return User.find({ 'github.lastSync': {
      $lte: moment().subtract(1, 'days'),
    } }).exec().then((users) => {
      this.users = new Users();
      return this.syncStarsOfUser(users);
    });
  }

  syncStarsOfUser(users) {
    if (users.length === 0) {
      return true;
    }
    const user = users.pop();
    return this.users.syncStars(user);
  }
}

export default SyncUserStars;
