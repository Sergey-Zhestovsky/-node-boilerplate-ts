/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */

type Primitives = string | number | boolean;

type NullablePrimitives = string | number | boolean | null | undefined;

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

type MaybePromise<T> = Promise<T> | T;

interface DeepObject<T> {
  [key: string]: Array<DeepObject<T> | T> | DeepObject<T> | T;
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
  }
}

declare namespace Express {
  interface Request {
    session: import('../api/auth/Session').Session;
  }

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
