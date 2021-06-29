import { Express } from 'express';
import swaggerUi, { JsonObject } from 'swagger-ui-express';

import { Client404Error } from '../libs/ClientError';
import swaggerConfig from '../config/swagger/swagger.config';

const swaggerMiddleware = (
  app: Express,
  swagger: () => Promise<JsonObject | null>,
  urlPath: string = '/swagger'
) => {
  if (!swaggerConfig.withSwagger) return;
  app.use(urlPath, swaggerUi.serve);
  const swaggerPromise = swagger();

  app.get(urlPath, async (req, res, next) => {
    const swaggerAPI = await swaggerPromise;

    if (swaggerAPI === null) {
      return next(new Client404Error());
    }

    return swaggerUi.setup(swaggerAPI)(req, res, next);
  });
};

export default swaggerMiddleware;
