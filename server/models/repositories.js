import mongoose from 'mongoose';

const releaseSchema = new mongoose.Schema({
  githubId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  tagName: {
    type: String,
    required: true,
  },
  htmlUrl: {
    type: String,
    required: true,
  },
  publishedAt: {
    type: Date,
    required: true,
  },
});

const repositorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  htmlUrl: {
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
  },
  latestRelease: {
    type: releaseSchema,
    required: false,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Repository = mongoose.model('Repository', repositorySchema);

export default Repository;
