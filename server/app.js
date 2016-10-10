import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import passport from 'passport';
import { apolloExpress, graphiqlExpress } from 'apollo-server';
import path from 'path';
import logger from './logger';
import { serializeUser, deserializeUser } from './passport/passport';
import gitHubStrategy from './passport/github';
import schema from './graphql/schema'; // eslint-disable-line import/no-named-as-default

// TODO 404 page
// TODO 500 page

// Configure env variables
dotenv.config();

// Connect to mongodb
mongoose.connect(process.env.MONGO_URL);
mongoose.Promise = Promise;

const app = express();
const MongoStore = connectMongo(session);

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: false,
}));

app.use(express.static('public'));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);
app.use(passport.initialize());
app.use(passport.session());
passport.use(gitHubStrategy());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/graphql', apolloExpress((req) => {
  const user = req.user;
  return {
    schema,
    context: {
      user,
    },
  };
}));

// Start graphiql server only in development
if (process.env.NODE_ENV !== 'production') {
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
  }));
}

app.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    res.sendFile(path.resolve('server/templates/index.html'));
  } else {
    res.sendFile(path.resolve('server/templates/app.html'));
  }
});

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  });

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Log mongodb
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
