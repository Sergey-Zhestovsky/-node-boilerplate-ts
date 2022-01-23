import { Request } from 'express';
import { VerifyOptions } from 'jsonwebtoken';
import { Strategy, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import { promisify } from 'util';

import { Config } from '@/libs/config';
import { IExtendedValidator, TSchemaContainer } from '@/libs/validator';
import { IJwtPayload } from '@/types/auth';
import { DecodedJwt } from './DecodedJwt';
import { Session } from '../../Session';
import { IJwtStrategyOptions, TVerifyCallback } from '../../types';

class JWTStrategy extends Strategy {
  static validationModel(joi: IExtendedValidator) {
    return {
      sid: joi.string(),
      uid: joi.string(),
      aud: joi.array().items(joi.string()).optional(),
      iss: joi.string().optional(),
      exp: joi.number().optional(),
      iat: joi.number().optional(),
    };
  }

  static verify(req: Request, payload: DecodedJwt<IJwtPayload> | null, done: VerifiedCallback) {
    // TODO:
    // const user = await db.actions.user.getById(payload.uid);
    // if (!user) done(new Client401Error);

    const session = Session.fromDecodedJwt<IJwtPayload>(req, payload);
    req.session = session;
    done(null, session, 'debilbnoe ');
  }

  protected options: StrategyOptions;
  protected verify: TVerifyCallback;
  protected validationModel: TSchemaContainer;
  protected secretOrKeyProvider: (req: Request, token: string) => Promise<string>;
  protected jwtVerifyOptions: VerifyOptions;

  constructor(
    options: IJwtStrategyOptions,
    verify: TVerifyCallback = JWTStrategy.verify,
    validationModel: TSchemaContainer = JWTStrategy.validationModel
  ) {
    const { getSecretOrKey } = options;
    const opt: StrategyOptions = { ...options, passReqToCallback: true };
    if (getSecretOrKey) opt.secretOrKey = getSecretOrKey();

    super(opt, verify);

    this.options = opt;
    this.verify = verify;
    this.validationModel = validationModel;

    // @ts-ignore: workaround - get access to the `secretOrKeyProvider` method
    // eslint-disable-next-line
    this.secretOrKeyProvider = promisify(this._secretOrKeyProvider.bind(this));
    // @ts-ignore: workaround - get access to the `verifOpts` property
    // eslint-disable-next-line
    this.jwtVerifyOptions = this._verifOpts;
  }

  async authenticate(req: Request, opt?: unknown) {
    const verified: VerifiedCallback = (err, user, info) => {
      if (err) return this.error(err);
      else if (!user) return this.fail(info);
      return this.success(user, info);
    };

    const token = this.options.jwtFromRequest(req);
    if (!token) return this.verify(req, null, verified);

    let secretOrPublicKey: string;
    let decodedJwt: DecodedJwt<IJwtPayload>;

    try {
      secretOrPublicKey = await this.secretOrKeyProvider(req, token);
    } catch (error) {
      return this.fail(error, 401);
    }

    try {
      decodedJwt = DecodedJwt.fromToken<IJwtPayload>(
        token,
        secretOrPublicKey,
        this.jwtVerifyOptions,
        {
          allowExpired: this.options.ignoreExpiration,
          validationModel: this.validationModel,
        }
      );
    } catch (error) {
      return this.fail(error, 401);
    }

    try {
      this.verify(req, decodedJwt, verified);
    } catch (error) {
      this.error(error as Error);
    }
  }
}

export const jwtStrategy = new JWTStrategy(Config.global.auth.jwtStrategy);
