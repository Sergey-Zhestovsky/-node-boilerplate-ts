import './core/helpers/setup-modules';
import './core/helpers/setup-process';
import './core/helpers/setup-environment';

import http from 'http';

import app from './express';
import { socket } from './app';
import db from './api/database';
import rbac from './api/rbac';
import { logger } from './libs/Logger';

const main = async (process: NodeJS.Process) => {
  try {
    await db.connection.connect();
    await rbac.synchronize();

    const server = http.createServer(app);
    socket(server);

    const port = Number(process.env.PORT ?? 3000);
    const host = process.env.HOST ?? undefined;

    server.listen(port, host, () => {
      const domain = `http://${host ?? 'localhost'}:${port}`;
      logger.info(`Server in '${process.env.NODE_ENV}' mode listening on: ${domain}`);
    });
  } catch (error) {
    logger.error(error as Error);
  }
};

void main(process);
