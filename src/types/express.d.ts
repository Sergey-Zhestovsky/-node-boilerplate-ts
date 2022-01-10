/* eslint-disable @typescript-eslint/naming-convention */

import express from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { ClientError, ClientRedirection } from '@/libs/server-responses';

export type ResResultData = ClientRedirection | object | string | null;

export type ResErrorData = ClientError | ResResultData;

export interface Request<ReqBody, ReqQuery, ResBody extends ResErrorData>
  extends express.Request<ParamsDictionary, ResBody, ReqBody, ReqQuery> {}

export interface Response<ResBody extends ResErrorData> extends express.Response<ResBody> {
  return(val?: ResBody, error?: ResErrorData): void;
  throw(error?: ResErrorData): void;
}

export interface RequestHandler<
  ReqBody = unknown,
  ReqQuery = unknown,
  ResBody extends ResErrorData = ResErrorData
> extends express.RequestHandler<ParamsDictionary, ResBody, ReqBody, ReqQuery> {
  (
    req: Request<ReqBody, ReqQuery, ResBody>,
    res: Response<ResBody>,
    next: express.NextFunction
  ): void;
}
