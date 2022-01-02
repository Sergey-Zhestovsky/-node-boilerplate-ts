import { Request, Response } from 'express';

import {
  ClientError,
  Client500Error,
  ServerError,
  ClientRedirection,
  IPublicError,
} from '@/libs/server-responses';
import { config } from '@/libs/config';

type TResultData = ClientRedirection | object | string | null;
type TErrorData = ClientError | TResultData;

type THandleResponse = <
  Res extends TResultData,
  Err extends Exclude<TErrorData, ClientRedirection>
>(
  result: Res,
  error: Err
) => {
  result: Res;
  isSuccess: Err extends null ? true : false;
  error: Err extends null ? null : IPublicError;
};

// @ts-ignore: ts weak understanding of returned types.
const handleResponse: THandleResponse = (result, error) => {
  const isSuccess = !error;
  let clientError: ClientError | null = null;

  if (error !== null) {
    if (error instanceof ServerError) {
      if (!config.isDevelopment()) error.removeStack();
      clientError = error;
    } else if (error instanceof ClientError) {
      clientError = error;
    } else {
      clientError = new Client500Error(error);
    }
  }

  return { result, isSuccess, error: clientError?.getError() ?? null };
};

const returnMixin = (res: Response, result: TResultData = null, error: TErrorData = null) => {
  if (result instanceof ClientRedirection) return result.redirect(res);
  if (error instanceof ClientRedirection) return error.redirect(res);
  return res.send(handleResponse(result, error));
};

const throwMixin = (res: Response, error?: TErrorData) => {
  if (error instanceof ClientRedirection) return error.redirect(res);
  const response = handleResponse(null, error ?? new Client500Error());
  return res.status(response.error.status).send(response);
};

export const mutateQuery = (req: Request, res: Response) => {
  res.return = (result, error) => returnMixin(res, result, error);
  res.throw = (error) => throwMixin(res, error);
  return { req, res };
};
