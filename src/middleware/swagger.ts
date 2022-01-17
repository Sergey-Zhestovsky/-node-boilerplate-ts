import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { OpenAPIV3 as OpenAPI } from 'openapi-types';

import { Client404Error } from '@/libs/server-responses';
import { config } from '@/libs/config';

export const swaggerMiddleware = (
  app: Express,
  swagger: Promise<OpenAPI.Document | null>,
  urlPath: string = '/swagger'
) => {
  if (!config.global.swagger.withSwagger) return;
  app.use(urlPath, swaggerUi.serve);

  app.get(urlPath, async (req, res, next) => {
    const swaggerAPI = await swagger;

    if (swaggerAPI === null) {
      return next(new Client404Error());
    }

    return swaggerUi.setup(swaggerAPI, {})(req, res, next);
  });
};
