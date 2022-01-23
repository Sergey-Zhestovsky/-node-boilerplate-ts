import './core/helpers/setup-modules';
import './core/helpers/setup-environment';
import './core/helpers/setup-process';

import http from 'http';

import app from './express';
import { socket } from './app';
import { db } from './api/database';
import rbac from './api/rbac';
import { HealthManager } from './libs/health-manager';
import { Localization } from './libs/localization';
import { Logger } from './libs/logger';
import { Config } from './libs/config';
import { getServerDomain } from './utils';

const main = async () => {
  const logger = new Logger('App');

  try {
    await Localization.init();
    await db.postgres.connect();
    await rbac.synchronize();

    const server = http.createServer(app);
    socket(server);

    const host = Config.env.HOST;
    const port = Config.env.PORT ?? 3000;

    server.listen(port, host, () => {
      const domain = getServerDomain({ host, port });
      logger.info(`Server in '${Config.nodeEnv}' mode listening on: ${domain}`);
    });
  } catch (error) {
    HealthManager.report(error);
  }
};

void main();
