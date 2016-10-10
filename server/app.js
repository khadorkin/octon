import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import logger from './logger';

// Configure env variables
dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

// Start listening on port
app.listen(process.env.PORT, () => {
  logger.info(`app started on port ${process.env.PORT}`);
});
