import express, { RequestHandler } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';

import { Config } from '@/libs/config';
import { passportAuthenticate } from './passport-authenticate';
import { queryLogger } from './query-logger';
import { mutateQuery } from './utils/query-mutator';

const setupCors = (): RequestHandler => {
  if (!Config.global.cors.withCors) return (req, res, next) => next();
  return cors(Config.global.cors.config);
};

const mutateQueryMiddleware = (): RequestHandler => (req, res, next) => {
  mutateQuery(req, res);
  next();
};

export const entry = [
  setupCors(),
  helmet(Config.global.helmet),
  express.urlencoded({ extended: false }),
  express.json({ limit: '150kb' }),
  cookieParser(),
  compression(),
  queryLogger(),
  mutateQueryMiddleware(),
  passportAuthenticate(),
];
