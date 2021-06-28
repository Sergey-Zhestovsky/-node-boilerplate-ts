import express, { RequestHandler } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import logger from '../libs/Logger';
import queryMutator from './utils/query-mutator';
import corsConfig from '../config/cors.config';
import helmetConfig from '../config/helmet.config';

const setupCors = (): RequestHandler => {
  if (!corsConfig.withCors) return (req, res, next) => next();
  return cors(corsConfig.config);
};

const mutateQuery: RequestHandler = (req, res, next) => {
  queryMutator(req, res);
  next();
};

export default [
  setupCors(),
  helmet(helmetConfig),
  express.urlencoded({ extended: false }),
  express.json({ limit: '150kb' }),
  cookieParser(),
  compression(),
  morgan(logger.middlewareOutput, { stream: logger.stream() }),
  mutateQuery,
];
