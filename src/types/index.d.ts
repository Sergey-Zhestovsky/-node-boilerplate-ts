/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
  }

  interface Process {
    initialEnvironmentConfig: Record<string, string>;
  }
}

declare namespace Express {
  interface Response {
    return(val?: object | string | null, error?: object): void;
    throw(error?: object): void;
  }
}

type ExpressRequest<ReqBody = any, ReqQuery = any, ResBody = any> = import('express').Request<
  import('express-serve-static-core').ParamsDictionary,
  ResBody,
  ReqBody,
  ReqQuery
>;
type ExpressQueryRequest<ReqQuery = any, ResBody = any> = ExpressRequest<any, ReqQuery, ResBody>;
type ExpressBodyRequest<ReqBody = any, ResBody = any> = ExpressRequest<ReqBody, any, ResBody>;

interface RequireDefaultModule<T = unknown> {
  default: T;
}
type RequireModule<T = unknown> = T | RequireDefaultModule<T>;

interface ServerResponse<Res = null, Err = null> {
  result: Res;
  isError: boolean;
  error: Err;
}

interface ServerErrorResponse<Err = null> extends ServerResponse<null, Err> {}
