import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  github: {
    id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

export default User;
