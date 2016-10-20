import 'babel-polyfill'; // eslint-disable-line
import dotenv from 'dotenv';
import Server from './core/server';

// Configure env variables
dotenv.config({ silent: true });

const envVariables = ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET', 'GITHUB_REDIRECT_URL',
  'MONGO_URL', 'MAIL_URL', 'SESSION_SECRET', 'PORT', 'BASE_URL'];
envVariables.forEach((env) => {
  if (!process.env[env]) {
    throw new Error(`Env variable ${env} not set`);
  }
});

const server = new Server();
server.start();
