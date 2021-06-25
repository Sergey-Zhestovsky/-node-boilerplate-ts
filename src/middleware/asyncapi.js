const path = require('path');
const express = require('express');

const { Client404Error } = require('../libs/ClientError');
const asyncapiConfig = require('../config/asyncapi/asyncapi.config');

/**
 * @param {express.Express} app
 * @param {() => Promise<string | null>} asyncapi
 */
const asyncapiMiddleware = (app, asyncapi) => {
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
    } else if (asyncapiResponse.path) {
      return res.sendFile(asyncapiResponse.path);
    } else if (asyncapiResponse.file) {
      return res.send(asyncapiResponse.file);
    }

    next();
  });
};

module.exports = asyncapiMiddleware;
