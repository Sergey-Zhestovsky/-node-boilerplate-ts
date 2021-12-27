import 'express-async-errors';
import express from 'express';

import { routes, swagger, asyncapi } from './app';
import { applyGraphql } from './apollo-server';
import {
  entry,
  errorHandler,
  swagger as swaggerMiddleware,
  asyncapi as asyncapiMiddleware,
} from './middleware';

const app = express();

void applyGraphql(app);

swaggerMiddleware(app, swagger, '/swagger');
asyncapiMiddleware(app, asyncapi, '/asyncapi');

app.use(entry);
app.use('/api/v1/', routes);
app.use(errorHandler);

export default app;
