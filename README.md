# octon

<p align="center">
  <img src="public/img/logo.png" alt="Octon logo">
</p>

[![Build Status](https://travis-ci.org/pradel/octon.svg?branch=master)](https://travis-ci.org/pradel/octon)
[![Coverage Status](https://coveralls.io/repos/github/pradel/octon/badge.svg?branch=master)](https://coveralls.io/github/pradel/octon?branch=master)

Notifies you when a new release has been made on repositories you starred on Github.

### Features

Emails you when a new release has been made on Github.
- Daily mail
- Weekly mail
- Github support
- Docker support

### Why

I wanted to create an app fully functioning with the latest javascript (es6, linting, coverage ...) and to learn how to build a real app from scratch with a graphql back and frontend.

### Stack

- [Nodejs](https://nodejs.org)
- [React](https://facebook.github.io/react)
- [Apollo](http://www.apollostack.com) - Graphql
- [MongoDb](https://www.mongodb.com/)

## Contribute

Pull requests are always welcome!

First you will need to have a mongodb server running.

1. `cp .env.default .env` Edit the .env file
2. `npm install` Install nodejs dependencies
3. `npm start:dev` Start the server and webpack

Before submitting a pull request, please verify that your branch pass the tests with command `npm run test`.

### Docker

`docker-compose -f docker/dev/docker-compose.yml up`
The app will run on port 3000.

Special thanks to [Quentin Saubadu](https://www.facebook.com/quentinsaubadu) for the logo and design!
