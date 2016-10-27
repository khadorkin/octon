import winston from 'winston';

const transports = [];
// Don't log error during tests
if (process.env.NODE_ENV !== 'test') {
  transports.push(new (winston.transports.Console)());
}

const logger = new (winston.Logger)({
  transports,
});

export default logger;
