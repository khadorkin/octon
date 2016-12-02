import GitHubStrategy from 'passport-github';
import User from '../models/users';
import Users from '../actions/users';
import logger from '../logger';

export function handleGithubReturn(accessToken, refreshToken, profile, cb) {
  return User.findOne({ 'github.id': profile.id }).exec().then((user) => {
    // If user already exist update his accessToken
    if (user) {
      user.photo = profile.photos[0].value;
      user.github.accessToken = accessToken;
      return user.save().then((data) => {
        cb(null, data);
      });
    }

    // Only get primary user email
    let primaryEmail;
    profile.emails.forEach((email) => {
      if (email.primary) {
        primaryEmail = email.value;
      }
    });

    // Create a new user
    const newUser = new User({
      photo: profile.photos[0].value,
      email: primaryEmail,
      github: {
        id: profile.id,
        username: profile.username,
        accessToken,
      },
    });
    return newUser.save().then((data) => {
      // When a user signup get his stars
      const users = new Users();
      users.syncStars(data)
        .catch((err) => {
          logger.log(err);
        });
      cb(null, data);
    });
  })
  .catch((err) => {
    cb(err);
  });
}

export default function () {
  return new GitHubStrategy.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}${process.env.GITHUB_REDIRECT_URL}`,
    scope: ['user:email'],
  }, handleGithubReturn);
}
