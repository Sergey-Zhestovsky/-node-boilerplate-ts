import path from 'path';
import express, { Express } from 'express';

import { TAsyncApiResponse, IPathContract, IFileContract } from '../loaders/asyncapi.loader';
import { Client404Error } from '../libs/ClientError';
import asyncapiConfig from '../config/asyncapi/asyncapi.config';

const asyncapiMiddleware = (app: Express, asyncapi: TAsyncApiResponse) => {
  if (!asyncapiConfig.withAsyncapi) return;

  app.use(
    '/asyncapi',
    express.static(
      path.resolve(__dirname, '../../node_modules', '@asyncapi/html-template/template'),
      { index: false, extensions: ['css', 'js'] }
    )
  );

  const asyncapiPromise = asyncapi();

  app.get('/asyncapi', async (req, res, next) => {
    const asyncapiResponse = await asyncapiPromise;

    if (asyncapiResponse === null) {
      return next(new Client404Error());
    } else if ((asyncapiResponse as IPathContract).path) {
      return res.sendFile((asyncapiResponse as IPathContract).path);
    } else if ((asyncapiResponse as IFileContract).file) {
      return res.send((asyncapiResponse as IFileContract).file);
    }

    next();
  });
};

export default asyncapiMiddleware;
