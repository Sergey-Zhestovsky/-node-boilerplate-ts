import express, { RequestHandler } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import { logger } from '@/libs/Logger';
import { mutateQuery } from './utils/query-mutator';

import corsConfig from '@/config/cors.config';
import helmetConfig from '@/config/helmet.config';

const setupCors = (): RequestHandler => {
  if (!corsConfig.withCors) return (req, res, next) => next();
  return cors(corsConfig.config);
};

const mutateQueryMiddleware = (): RequestHandler => (req, res, next) => {
  mutateQuery(req, res);
  next();
};

export const entry = [
  setupCors(),
  helmet(helmetConfig),
  express.urlencoded({ extended: false }),
  express.json({ limit: '150kb' }),
  cookieParser(),
  compression(),
  morgan(logger.middlewareOutput, { stream: logger.stream() }),
  mutateQueryMiddleware(),
];
