import User from '../models/users';

export function serializeUser(user, done) {
  done(null, user.id);
}

export function deserializeUser(id, done) {
  return User.findOne({ _id: id }).exec().then((user) => {
    done(null, user);
  })
  .catch((err) => {
    done(err);
  });
}
