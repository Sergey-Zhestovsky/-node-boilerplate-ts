import './core/helpers/setup-modules';
import './core/helpers/setup-environment';
import './core/helpers/setup-process';

import http from 'http';

import app from './express';
import { socket } from './app';
import { db } from './api/database';
import rbac from './api/rbac';
import { localization } from './libs/localization';
import { logger } from './libs/Logger';
import { config } from './libs/config';
import { getServerDomain } from './utils';

const main = async () => {
  try {
    await localization.init();
    await db.postgres.connect();
    await rbac.synchronize();

    const server = http.createServer(app);
    socket(server);

    const host = config.env.HOST;
    const port = config.env.PORT ?? 3000;

    server.listen(port, host, () => {
      const domain = getServerDomain({ host, port });
      logger.info(`Server in '${config.nodeEnv}' mode listening on: ${domain}`);
    });
  } catch (error) {
    logger.error(error as Error);
  }
};

void main();
