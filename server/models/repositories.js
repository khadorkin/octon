import mongoose from 'mongoose';

const releaseSchema = new mongoose.Schema({
  refId: {
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
  description: {
    type: String,
    required: false,
  },
  htmlUrl: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  refId: {
    type: String,
    required: true,
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

repositorySchema.methods.setLatestRelease = function setLatestRelease(release) {
  if (!release ||
    (this.latestRelease &&
    release.refId.toString() === this.latestRelease.refId.toString())) {
    return false;
  }
  // If new release
  this.latestRelease = release;
  return true;
};

const Repository = mongoose.model('Repository', repositorySchema);

export default Repository;
