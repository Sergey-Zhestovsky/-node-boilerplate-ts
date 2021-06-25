require('express-async-errors');

const express = require('express');

const { routes, swagger, asyncapi } = require('./app');
const { middleware: gqlMiddleware } = require('./apollo-server');
const {
  entry,
  errorHandler,
  swagger: swaggerMiddleware,
  asyncapi: asyncapiMiddleware,
} = require('./middleware');

const app = express();

swaggerMiddleware(app, swagger);
asyncapiMiddleware(app, asyncapi);

app.use(entry);
app.use('/api/v1/', routes);
app.use(gqlMiddleware);
app.use(errorHandler);

module.exports = app;
