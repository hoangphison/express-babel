'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import split from 'split';
import { NotFound } from 'throw.js';
import path from 'path';

import logger from './logger';
import routes from './routes';

const app = express();

app.use(morgan('combined', {
  'stream': split().on('data', (line) => {
    logger.info(line);
  }),
  'skip': () => app.get('env') === 'test',
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, '../public')));

app.use('/', routes);

app.use((req, res, next) => {
  return next(new NotFound());
});

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars

  logger.error(err);

  return res
    .status(err.statusCode || 500)
    .json({
      'status': 'error',
      'message': err.message,
      'code': err.errorCode,
    });

});

export default app;
