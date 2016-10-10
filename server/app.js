import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import logger from './logger';

// Configure env variables
dotenv.config();

// Connect to mongodb
mongoose.connect(process.env.MONGO_URL);
mongoose.Promise = Promise;

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('connected to mongodb');
});
db.on('error', (err) => {
  logger.log('error', err);
});

// Start listening on port
app.listen(process.env.PORT, () => {
  logger.info(`app started on port ${process.env.PORT}`);
});
