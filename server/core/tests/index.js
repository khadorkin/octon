import mongoose from 'mongoose';
import faker from 'faker';
import User from '../../models/users';
import Repository from '../../models/repositories';

export function connectDb() {
  mongoose.Promise = Promise;
  mongoose.connect(process.env.MONGO_URL);
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
  const db = mongoose.connection;
  mongoose.disconnect();
  db.on('disconnected', () => {
    done();
  });
}

export function createUser() {
  const user = new User({
    username: faker.name.firstName(),
    photo: faker.image.imageUrl(),
    github: {
      id: faker.random.uuid(),
      email: faker.internet.email(),
      accessToken: faker.random.uuid(),
    },
    starred: [{
      active: false,
      repositoryId: '57ff5c5c74b8ac07d4d1b0f0',
    }, {
      active: true,
      repositoryId: '57ff5c5c74b8ac07d4d1b0e9',
    }],
  });
  return user.save();
}

export function createRepository() {
  const repository = new Repository({
    name: faker.name.findName(),
    htmlUrl: faker.internet.url(),
    photo: faker.image.imageUrl(),
    type: 'github',
    refId: faker.random.uuid(),
  });
  return repository.save();
}
