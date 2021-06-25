const { Express } = require('express');
const swaggerUi = require('swagger-ui-express');

const { Client404Error } = require('../libs/ClientError');
const swaggerConfig = require('../config/swagger/swagger.config');

/**
 * @param {Express} app
 * @param {() => Promise<swaggerUi.JsonObject | null>} swagger
 */
const swaggerMiddleware = (app, swagger) => {
  if (!swaggerConfig.withSwagger) return;
  app.use('/swagger', swaggerUi.serve);
  const swaggerPromise = swagger();

  app.get('/swagger', async (req, res, next) => {
    const swaggerAPI = await swaggerPromise;

    if (swaggerAPI === null) {
      return next(new Client404Error());
    }

    return swaggerUi.setup(swaggerAPI)(req, res, next);
  });
};

module.exports = swaggerMiddleware;
