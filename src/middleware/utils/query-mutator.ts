import { Request, Response } from 'express';

import { ClientError, Client500Error } from '../../libs/ClientError';

type TResultData = string | object | null;
type TErrorData = ClientError | TResultData;

const sendObjMixin = (res: Response, result: TResultData = null, error: TErrorData = null) => {
  const isSuccess = !error;
  return res.send({ result, isSuccess, error });
};

const throwMixin = (res: Response, error?: TErrorData) => {
  let clientError: ClientError;
  if (error instanceof ClientError) clientError = error;
  else clientError = new Client500Error();
  return res.status(clientError.status).return(null, clientError.getError());
};

const mutator = (req: Request, res: Response) => {
  res.return = (result, error) => sendObjMixin(res, result, error);
  res.throw = (error) => throwMixin(res, error);
  return { req, res };
};

export default mutator;
