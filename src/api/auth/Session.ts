import { Request } from 'express';
import parseUserAgent, { IResult as IUserAgent } from 'ua-parser-js';

import { IJwtPayload } from '@/types/auth';
import { retrieveIpAddress } from '@/utils';
import { DecodedJwt } from './strategies/jwt-strategy/DecodedJwt';

interface ISessionConnection<T> {
  ip: string;
  userAgent: IUserAgent;
  origin: T | null;
}

interface IDecodedJwtOrigin<P extends object> {
  payload: P | null;
  token: string | null;
}

interface ISessionData {
  isAuthenticated: boolean;
  isAuthorized: boolean;
  isExpired: boolean;
}

export class Session<
  P extends object = IJwtPayload,
  ConType extends IDecodedJwtOrigin<P> = IDecodedJwtOrigin<P>
> {
  static fromDecodedJwt<P extends IJwtPayload>(req: Request, decodedJwt: DecodedJwt<P> | null) {
    const user = decodedJwt ? {} : null;

    const sessionData: ISessionData = {
      isAuthenticated: !!decodedJwt,
      isAuthorized: !!decodedJwt,
      isExpired: decodedJwt?.meta.tokenExpired ?? false,
    };

    const connection: ISessionConnection<IDecodedJwtOrigin<P>> = {
      ip: retrieveIpAddress(req),
      userAgent: parseUserAgent(req.headers['user-agent']),
      origin: {
        payload: decodedJwt?.payload ?? null,
        token: decodedJwt?.token ?? null,
      },
    };

    return new Session<P, IDecodedJwtOrigin<P>>(user, sessionData, connection);
  }

  constructor(
    public user: object | null,
    public session: ISessionData,
    public connection: ISessionConnection<ConType>
  ) {}

  permitted() {
    return true;
  }

  isAuthenticated() {
    return this.session.isAuthenticated;
  }

  isAuthorized() {
    return this.session.isAuthorized;
  }

  isExpired() {
    return this.session.isExpired;
  }
}
