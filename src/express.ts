import 'express-async-errors';
import express from 'express';

import { routes, asyncapi } from './app';
import { applyGraphql } from './apollo-server';
import { entry, errorHandlers, swaggerMiddleware, asyncapiMiddleware } from './middleware';
import { Swagger } from './libs/swagger';

const app = express();

void applyGraphql(app);

swaggerMiddleware(app, Swagger.build(), '/swagger');
asyncapiMiddleware(app, asyncapi, '/asyncapi');

app.use(entry);
app.use('/api/v1/', routes);
app.use(errorHandlers);

export default app;
