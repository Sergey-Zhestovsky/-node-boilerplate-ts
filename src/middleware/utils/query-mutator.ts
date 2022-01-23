import { Request, Response } from 'express';

import { ResResultData, ResErrorData } from '@/core/express';
import {
  ClientError,
  Client500Error,
  ServerError,
  ClientRedirection,
  IPublicError,
} from '@/libs/server-responses';
import { Swagger } from '@/libs/swagger';
import { Config } from '@/libs/config';

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
      if (!Config.isDevelopment()) error.removeStack();
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

Swagger.setResultResponseSchema((ref?: string) => {
  return {
    schema: {
      type: 'object',
      properties: {
        result: ref ? { $ref: ref } : { default: null },
        isSuccess: {
          type: 'boolean',
          default: true,
        },
        error: {
          type: 'object',
          nullable: true,
          default: null,
        },
      },
    },
  };
});

const returnMixin = (req: Request, res: Response) => {
  return (result: ResResultData = null, error: ResErrorData = null) => {
    if (result instanceof ClientRedirection) return result.redirect(res);
    if (error instanceof ClientRedirection) return error.redirect(res);
    return res.send(handleResponse(req, result, error));
  };
};

Swagger.setErrorResponseSchema(() => {
  return {
    schema: {
      type: 'object',
      properties: {
        result: {
          default: null,
        },
        isSuccess: {
          type: 'boolean',
          default: false,
        },
        error: Swagger.getSchema('ClientError').schema,
      },
    },
  };
});

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
