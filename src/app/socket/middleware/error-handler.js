require('events').captureRejections = true;

const { ClientError, Client401Error, Client500Error } = require('../../../libs/ClientError');
const { ClientRedirection } = require('../../../libs/ClientRedirection');
const ServerError = require('../../../libs/ServerError');
const logger = require('../../../libs/Logger');
const env = require('../../../data/env.json');

const handleError = (error, socket) => {
  if (error instanceof ClientError) {
    socket.emit('error', error.getError());
    if (error instanceof Client401Error) socket.disconnet();
    return;
  }

  if (error instanceof ClientRedirection) {
    socket.emit('error', error.getRedirection());
    socket.disconnet();
    return;
  }

  const serverError = new ServerError(error);
  logger.error(`Unhandled error: '${error.name}': '${error.message}'.\n${error.stack}`);

  if (process.env.NODE_ENV === env.DEVELOPMENT) {
    socket.emit('error', serverError.getError());
  } else {
    socket.emit('error', new Client500Error().getError());
  }
};

const rejectHandler = (server, socket) => {
  socket[Symbol.for('nodejs.rejection')] = (error) => handleError(error, socket);
};

const basicHandler = (server, socket) => {
  socket.on('error', (error) => handleError(error, socket));
};

module.exports = [rejectHandler, basicHandler];
