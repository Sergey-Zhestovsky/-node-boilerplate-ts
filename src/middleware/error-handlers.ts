import { RequestHandler, ErrorRequestHandler } from 'express';

import {
  ClientRedirection,
  ServerError,
  ClientError,
  Client404Error,
} from '@/libs/server-responses';
import { logger } from '@/libs/Logger';

const client404Error: RequestHandler = (req, res, next) => {
  return next(new Client404Error());
};

const clientError: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof ClientError) return res.throw(error);
  if (error instanceof ClientRedirection) return error.redirect(res);
  return next(error);
};

const serverError: ErrorRequestHandler = (error, req, res, next) => {
  const err = ServerError.create(error);
  void err.correlate();
  logger.error(`Unhandled server error: '${err.name}': '${err.message}'.\n${err.stack ?? ''}`);
  return res.throw(err);
};

export const errorHandlers = [client404Error, clientError, serverError];
