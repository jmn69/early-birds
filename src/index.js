import '@babel/polyfill';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import expressWinston from 'express-winston';
import Mongoose from 'mongoose';
import cors from 'cors';

import winstonInstance from '../config/winston';
import connectToDb from '../db/connect';

Promise = require('bluebird'); // eslint-disable-line no-global-assign

Mongoose.Promise = Promise;

const DEV = process.env.NODE_ENV === 'development';
const TEST = process.env.NODE_ENV === 'test';
const port = DEV ? 3000 : 4030;
const app = express();

connectToDb();

if (DEV) {
  app.use(logger('dev'));
}

// enable detailed API logging in dev env
if (DEV) {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(
    expressWinston.logger({
      winstonInstance,
      meta: true, // optional: log meta data about request (defaults to true)
      msg:
        'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
      colorStatus: true, // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
    }),
  );
}

app.use(cors());
// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// log error in winston transports except when executing test suite
if (!TEST) {
  app.use(
    expressWinston.errorLogger({
      winstonInstance,
    }),
  );
}

app.listen(port, () => {
  console.log(`BUILD COMPLETE -- Listening @  http://localhost:${port}/`);
});
