import './utils/setup-process';

import http from 'http';

import app from './express';
// const { socket } = require('./app');
// const db = require('./api/database');
// const rbac = require('./api/rbac');
import logger from './libs/Logger';
import setupEnvironment from './utils/setup-environment';

setupEnvironment();

const main = async (process: NodeJS.Process) => {
  try {
    // await db.connection.connect();
    // await rbac.synchronize();

    const server = http.createServer(app);
    // socket(server);

    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST ?? 'localhost';

    server.listen(port, host, () => {
      logger.info(`Server in '${process.env.NODE_ENV}' mode listening on: http://${host}:${port}`);
    });
  } catch (error) {
    logger.error(error);
  }
};

void main(process);
