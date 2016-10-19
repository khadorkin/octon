import GitHubStrategy from 'passport-github';
import User from '../models/users';

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
      username: profile.username,
      photo: profile.photos[0].value,
      email: primaryEmail,
      github: {
        id: profile.id,
        accessToken,
      },
    });
    return newUser.save().then((data) => {
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
    callbackURL: process.env.GITHUB_REDIRECT_URL,
    scope: ['user:email'],
  }, handleGithubReturn);
}
