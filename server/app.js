require('newrelic'); // eslint-disable-line
import 'babel-polyfill'; // eslint-disable-line
import dotenv from 'dotenv'; // eslint-disable-line import/first
import Server from './core/server'; // eslint-disable-line import/first

// Configure env variables
dotenv.config({ silent: true });

const envVariables = ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET', 'MONGO_URL'];
envVariables.forEach((env) => {
  if (!process.env[env]) {
    throw new Error(`Env variable ${env} not set`);
  }
});

if (!process.env.MAIL_URL) {
  console.log('Warning: you have not set the MAIL_URL env variable, you will not be able to send mails via the app'); // eslint-disable-line no-console
}
if (!process.env.BASE_URL) {
  console.log('Warning: you have not set the BASE_URL env variable, the default url is now http://localhost:3000'); // eslint-disable-line no-console
}
if (!process.env.SESSION_SECRET) {
  console.log('Warning: you have not set the SESSION_SECRET env variable, we use "secret" as a default secret but it is not good for production'); // eslint-disable-line no-console
}

const server = new Server();
server.start();
