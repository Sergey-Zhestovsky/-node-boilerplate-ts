import { RequestHandler, ErrorRequestHandler } from 'express';

import { ClientError, Client404Error } from '../libs/ClientError';
import { ClientRedirection } from '../libs/ClientRedirection';
import ServerError from '../libs/ServerError';
import logger from '../libs/Logger';
import env from '../data/env.json';

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
  if (process.env.NODE_ENV !== env.DEVELOPMENT) err.removeStack();
  return res.throw(err);
};

export default [client404Error, clientError, serverError];
