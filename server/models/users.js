import mongoose from 'mongoose';

const starred = new mongoose.Schema({
  repositoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const userGithub = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  lastSync: {
    type: Date,
  },
}, { _id: false });

const userDocker = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  lastSync: {
    type: Date,
  },
}, { _id: false });

const userSchema = new mongoose.Schema({
  photo: {
    type: String,
    required: true,
  },
  starred: {
    type: [starred],
    default: [],
  },
  dailyNotification: {
    type: Boolean,
    required: true,
    default: true,
  },
  weeklyNotification: {
    type: Boolean,
    required: true,
    default: false,
  },
  email: {
    type: String,
    required: true,
  },
  github: {
    type: userGithub,
    required: true,
  },
  docker: {
    type: userDocker,
    required: false,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

function getActiveStarred(userStarred, id) {
  for (let i = 0; i < userStarred.length; i += 1) {
    if (userStarred[i].repositoryId.toString() === id.toString()) {
      return userStarred[i].active;
    }
  }
  return true;
}

userSchema.methods.setStars = (userStarred, newStars, type) => {
  // Only keep other type stars
  const stars = userStarred.filter(star => star.type !== type);
  // For each new stars add it to user
  newStars.forEach((star) => {
    stars.push({
      repositoryId: star,
      active: getActiveStarred(userStarred, star),
      type,
    });
  });
  return stars;
};

const User = mongoose.model('User', userSchema);

export default User;
