/* eslint-disable @typescript-eslint/naming-convention */

import core from 'express-serve-static-core';

import { ClientError, ClientRedirection } from '@/libs/server-responses';

export type ResResultData = ClientRedirection | object | string | null;

export type ResErrorData = ClientError | ResResultData;

export type ResponseType = ResErrorData;

export interface Request<ReqParams, ResBody extends ResponseType, ReqBody, ReqQuery>
  extends core.Request<ReqParams, ResBody, ReqBody, ReqQuery> {}

export interface Response<ResBody extends ResponseType> extends core.Response<ResBody> {
  return(val?: ResBody | null, error?: ResErrorData): void;
  throw(error?: ResErrorData): void;
}

export type RequestHandler<
  ReqParams = unknown,
  ResBody extends ResponseType = never,
  ReqBody = unknown,
  ReqQuery = unknown
> = (
  req: Request<ReqParams, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: core.NextFunction
) => void;

export type ErrorRequestHandler<
  ReqParams = unknown,
  ResBody extends ResponseType = never,
  ReqBody = unknown,
  ReqQuery = unknown
> = (
  err: unknown,
  req: Request<ReqParams, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: core.NextFunction
) => void;

export type RequestHandlerParams<
  ReqParams = unknown,
  ResBody extends ResponseType = ResponseType,
  ReqBody = unknown,
  ReqQuery = unknown
> =
  | RequestHandler<ReqParams, ResBody, ReqBody, ReqQuery>
  | ErrorRequestHandler<ReqParams, ResBody, ReqBody, ReqQuery>
  | Array<
      | RequestHandler<ReqParams, ResBody, ReqBody, ReqQuery>
      | core.ErrorRequestHandler<ReqParams, ResBody, ReqBody, ReqQuery>
    >;

export interface IRouterMatcher<T> {
  <
    ReqParams = unknown,
    ResBody extends ResponseType = ResponseType,
    ReqBody = unknown,
    ReqQuery = unknown
  >(
    path: core.PathParams,
    ...handlers: Array<RequestHandler<ReqParams, ResBody, ReqBody, ReqQuery>>
  ): T;

  <
    ReqParams = unknown,
    ResBody extends ResponseType = ResponseType,
    ReqBody = unknown,
    ReqQuery = unknown
  >(
    path: core.PathParams,
    ...handlers: Array<RequestHandlerParams<ReqParams, ResBody, ReqBody, ReqQuery>>
  ): T;
  (path: core.PathParams, subApplication: core.Application): T;
}
