require('./utils/setup-environment')();
require('./utils/setup-process');

const http = require('http');

const app = require('./express');
const { socket } = require('./app');
const db = require('./api/database');
const rbac = require('./api/rbac');
const logger = require('./libs/Logger');

const main = async (process) => {
  try {
    await db.connection.connect();
    await rbac.synchronize();

    const server = http.createServer(app);
    socket(server);

    const port = process.env.PORT || 3000;
    const host = process.env.HOST || 'localhost';

    server.listen(port, host, () => {
      logger.info(`Server in '${process.env.NODE_ENV}' mode listening on: http://${host}:${port}`);
    });
  } catch (error) {
    logger.error(error);
  }
};

main(process);
