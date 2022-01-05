import { jwtStrategy } from './jwt-strategy';

export enum EPassportStrategy {
  JWT = 'jwt',
}

export const strategies = {
  [EPassportStrategy.JWT]: jwtStrategy,
};
