import { RequestHandler } from 'express';

export const roleGuard: RequestHandler = (req, res, next) => {
  next();
};
