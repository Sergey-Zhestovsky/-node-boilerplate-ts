export interface IJwtPayload {
  sid: string;
  uid: string;
  aud: string[];

  iss?: string;
  exp?: number;
  iat?: number;
}
