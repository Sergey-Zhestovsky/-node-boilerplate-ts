import { NextFunction, Request, RequestHandler, Response } from 'express';

import { passport, EPassportStrategy } from '@/api/auth';
import { Client401Error } from '@/libs/server-responses';

type TPassportCallback = (
  err: Error | null,
  user: object | boolean,
  info: unknown,
  status: number
) => void;

type TWrappedPassportCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => TPassportCallback;

const defaultCb: TWrappedPassportCallback = (req, res, next) => (err, user, info, status) => {
  if (err || !user) return next(new Client401Error());
  return next();
};

export const passportAuthenticate = (callback: TWrappedPassportCallback = defaultCb) => {
  return ((req, res, next) => {
    return (
      passport.authenticate(
        EPassportStrategy.JWT,
        {
          session: false,
          failWithError: false,
        },
        callback(req, res, next)
      ) as RequestHandler
    )(req, res, next);
  }) as RequestHandler;
};
