import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import passport from 'passport';
import { apolloExpress, graphiqlExpress } from 'apollo-server';
import path from 'path';
import logger from '../logger';
import { serializeUser, deserializeUser } from '../passport/passport';
import gitHubStrategy from '../passport/github';
import schema from '../graphql/schema'; // eslint-disable-line import/no-named-as-default
import Users from '../actions/users';
import Cron from '../cron';

// TODO 404 page
// TODO 500 page

class Server {
  async start() {
    await this.startMongo();

    this.app = express();
    const MongoStore = connectMongo(session);

    this.app.use(session({
      secret: process.env.SESSION_SECRET,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
      resave: false,
      saveUninitialized: false,
    }));

    this.app.use(express.static('public'));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    passport.use(gitHubStrategy());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    this.app.use('/graphql', apolloExpress((req) => {
      const user = req.user;
      return {
        schema,
        context: {
          user,
          Users: new Users(),
        },
      };
    }));

    if (process.env.NODE_ENV !== 'production') {
      // Start graphiql server
      this.app.use('/graphiql', graphiqlExpress({
        endpointURL: '/graphql',
      }));

      if (process.env.NODE_ENV !== 'test') {
        // Start webpack dev server
        const webpack = require('webpack'); // eslint-disable-line
        const WebpackDevServer = require('webpack-dev-server'); // eslint-disable-line
        const config = require('../webpack.config.js'); // eslint-disable-line
        const compiler = webpack(config);
        const options = {
          hot: true,
          inline: true,
          stats: {
            chunks: false,
          },
        };
        if (process.env.NODE_ENV === 'test') {
          options.stats.warnings = false;
          options.stats.version = false;
          options.stats.timings = false;
          options.stats.assets = false;
          options.stats.hash = false;
          options.stats.modules = false;
        }
        this.webpackServer = new WebpackDevServer(compiler, options);
        await this.startWebpackServer();
      }
    }

    this.app.get('/', (req, res) => {
      if (!req.isAuthenticated()) {
        res.sendFile(path.resolve('server/templates/index.html'));
      } else {
        res.sendFile(path.resolve('server/templates/app.html'));
      }
    });

    this.app.get('/auth/github', passport.authenticate('github'));

    this.app.get('/auth/github/callback',
      passport.authenticate('github', { failureRedirect: '/' }),
      (req, res) => {
        res.redirect('/');
      });

    this.app.get('/logout', (req, res) => {
      req.logout();
      res.redirect('/');
    });

    await this.startExpressServer();

    // Start cron tasks
    this.cron = new Cron();
    this.cron.start();
  }

  startMongo() {
    // Connect to mongodb
    mongoose.connect(process.env.MONGO_URL);
    mongoose.Promise = Promise;
    const db = mongoose.connection;
    return new Promise((resolve, reject) => {
      db.on('connected', () => {
        logger.info('connected to mongodb');
        resolve();
      });
      db.on('error', (err) => {
        logger.log('error', err);
        reject(err);
      });
    });
  }

  startExpressServer() {
    return new Promise((resolve) => {
      // Start listening on port
      this.server = this.app.listen(process.env.PORT, () => {
        logger.info(`app started on port ${process.env.PORT}`);
        resolve();
      });
    });
  }

  startWebpackServer() {
    return new Promise((resolve) => {
      // Start listening on port
      this.webpackServer.listen(process.env.WEBPACK_PORT, () => {
        logger.info(`webpack-dev-server started on port ${process.env.WEBPACK_PORT}`);
        resolve();
      });
    });
  }

  stop() {
    // Stop cron tasks
    this.cron.stop();
    // Stop mongodb
    const db = mongoose.connection;
    mongoose.disconnect();
    return new Promise((resolve) => {
      db.on('disconnected', () => {
        // Stop webpack server
        if (this.webpackServer) this.webpackServer.close();
        // Stop express
        this.server.close();
        resolve();
      });
    });
  }
}

export default Server;