import mongoose from 'mongoose';
import User from '../../models/users';
import Repository from '../../models/repositories';

export function connectDb() {
  mongoose.Promise = Promise;
  mongoose.connect(MONGO_TEST_URL);
  const db = mongoose.connection;
  return new Promise((resolve) => {
    db.once('open', () => {
      resolve();
    });
  });
}

export async function dropDb() {
  await User.remove({}).exec();
  await Repository.remove({}).exec();
}

export async function disconnectDb(done) {
  await dropDb();
  mongoose.disconnect();
  done();
}

export function createUser() {
  const user = new User({
    username: 'username',
    photo: 'photo',
    github: {
      id: 'id',
      email: 'email',
      accessToken: 'accessToken',
    },
    starred: [{
      active: false,
      githubId: 'githubId1',
    }, {
      active: true,
      githubId: 'githubId2',
    }],
  });
  return user.save();
}
