import { Request, Response } from 'express';

import {
  ClientError,
  Client500Error,
  ServerError,
  ClientRedirection,
  IPublicError,
} from '@/libs/server-responses';
import { config } from '@/libs/config';
import { ResResultData, ResErrorData } from '@/types/express';

type THandleResponse = <
  Res extends ResResultData,
  Err extends Exclude<ResErrorData, ClientRedirection>
>(
  req: Request,
  result: Res,
  error: Err
) => {
  result: Res;
  isSuccess: Err extends null ? true : false;
  error: Err extends null ? null : IPublicError;
};

// @ts-ignore: ts weak understanding of returned types.
const handleResponse: THandleResponse = (req, result, error) => {
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

  return {
    result,
    isSuccess,
    error: clientError?.getError(req.session.connection.language) ?? null,
  };
};

const returnMixin = (req: Request, res: Response) => {
  return (result: ResResultData = null, error: ResErrorData = null) => {
    if (result instanceof ClientRedirection) return result.redirect(res);
    if (error instanceof ClientRedirection) return error.redirect(res);
    return res.send(handleResponse(req, result, error));
  };
};

const throwMixin = (req: Request, res: Response) => {
  return (error?: ResErrorData) => {
    if (error instanceof ClientRedirection) return error.redirect(res);
    const response = handleResponse(req, null, error ?? new Client500Error());
    return res.status(response.error.status).send(response);
  };
};

export const mutateQuery = (req: Request, res: Response) => {
  res.return = returnMixin(req, res);
  res.throw = throwMixin(req, res);
  return { req, res };
};
