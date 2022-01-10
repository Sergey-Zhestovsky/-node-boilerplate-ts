import express, { RequestHandler } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import { logger } from '@/libs/logger';
import { config } from '@/libs/config';
import { passportAuthenticate } from './passport-authenticate';
import { mutateQuery } from './utils/query-mutator';

const setupCors = (): RequestHandler => {
  if (!config.global.cors.withCors) return (req, res, next) => next();
  return cors(config.global.cors.config);
};

const mutateQueryMiddleware = (): RequestHandler => (req, res, next) => {
  mutateQuery(req, res);
  next();
};

export const entry = [
  setupCors(),
  helmet(config.global.helmet),
  express.urlencoded({ extended: false }),
  express.json({ limit: '150kb' }),
  cookieParser(),
  compression(),
  morgan(logger.middlewareOutput, { stream: logger.stream() }),
  mutateQueryMiddleware(),
  passportAuthenticate(),
];
