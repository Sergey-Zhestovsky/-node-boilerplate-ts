import { Request } from 'express';
import { StrategyOptions, VerifiedCallback } from 'passport-jwt';

import { IJwtPayload } from '@/types/auth';
import { DecodedJwt } from '../strategies/jwt-strategy';
import { TSchemaContainer } from '@/libs/validator';

export interface IJwtStrategyOptions extends Omit<StrategyOptions, 'passReqToCallback'> {
  getSecretOrKey?: () => string | Buffer | undefined;
}

export type TVerifyCallback = (
  req: Request,
  result: DecodedJwt<IJwtPayload> | null,
  done: VerifiedCallback
) => void;

export interface IFromTokenOptions {
  allowExpired?: boolean;
  validationModel?: TSchemaContainer;
}

export interface IAuthenticationResultMetadata {
  tokenExpired: boolean;
}
