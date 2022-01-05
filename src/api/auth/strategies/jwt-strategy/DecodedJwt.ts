import jwt, { TokenExpiredError, VerifyOptions, Secret, JwtPayload } from 'jsonwebtoken';

import { Validator, TSchemaContainer } from '@/libs/validator';
import { IAuthenticationResultMetadata, IFromTokenOptions } from '../../types';

export class DecodedJwt<P extends JwtPayload | string = JwtPayload> {
  private static validateTokenPayloadStructure(token: string, validationModel: TSchemaContainer) {
    const payload = jwt.decode(token);

    const validator = new Validator();
    validator.setSchema(validationModel);
    const res = validator.validate(payload);

    if (!res || res.errors) {
      throw new Error('Token payload has invalid structure.');
    }

    return true;
  }

  private static decodeJwt<P extends JwtPayload | string>(
    token: string,
    secretOrPublicKey: Secret,
    verifyOptions: VerifyOptions
  ) {
    const result = jwt.verify(token, secretOrPublicKey, verifyOptions);
    return result as P;
  }

  static fromToken<P extends JwtPayload | string = JwtPayload>(
    token: string,
    secretOrPublicKey: Secret,
    verifyOptions: VerifyOptions,
    options: IFromTokenOptions = {}
  ) {
    const { allowExpired = false, validationModel } = options;
    const meta = { tokenExpired: false };
    let payload: P;

    if (validationModel) {
      DecodedJwt.validateTokenPayloadStructure(token, validationModel);
    }

    try {
      payload = DecodedJwt.decodeJwt<P>(token, secretOrPublicKey, verifyOptions);
    } catch (error) {
      if (error instanceof TokenExpiredError && allowExpired) {
        meta.tokenExpired = true;
        payload = DecodedJwt.decodeJwt<P>(token, secretOrPublicKey, {
          ...verifyOptions,
          ignoreExpiration: true,
        });
      } else {
        throw error;
      }
    }

    return new DecodedJwt<P>(payload, token, meta);
  }

  constructor(
    public payload: P,
    public token: string,
    public meta: IAuthenticationResultMetadata
  ) {}
}
