import { RequestHandler } from 'express';

import { Client401Error, Client403Error, ClientError } from '@/libs/server-responses';

export interface IAuthGuardOptions {
  authorized?: boolean;
  authenticated?: boolean;
  sessionExpired?: boolean;
}

const DEFAULT_OPTIONS: IAuthGuardOptions = {
  authorized: true,
  authenticated: true,
  sessionExpired: false,
};

export const authGuard = (options = DEFAULT_OPTIONS): RequestHandler => {
  const { authorized, authenticated, sessionExpired } = { ...DEFAULT_OPTIONS, ...options };

  return (req, res, next) => {
    const session = req.session;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!session) return next(new Client401Error());

    if (authorized && !session.isAuthorized()) {
      return next(new Client403Error());
    }

    if (authenticated && !session.isAuthenticated()) {
      return next(new Client403Error());
    }

    if (!sessionExpired && session.isExpired()) {
      return next(new ClientError.from.ExpiredToken());
    }

    return next();
  };
};
