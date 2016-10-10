import mongoose from 'mongoose';
import User from '../../models/users';

export function connectDb() {
  mongoose.Promise = Promise;
  mongoose.connect(MONGO_TEST_URL);
  const db = mongoose.connection;
  return new Promise((resolve, reject) => {
    db.on('error', (err) => {
      reject(err);
    });
    db.once('open', () => {
      resolve();
    });
  });
}

export function disconnectDb(done) {
  // TODO drop database
  mongoose.disconnect();
  done();
}

export function dropDb() {
  return User.remove({}).exec();
}
