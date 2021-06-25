const { Server } = require('socket.io');

const HeartbeatRoom = require('../rooms/HeartbeatRoom');

/** @param {Server} server */
const heartbeatController = (server) => {
  server.on('connect', (socket) => {
    const heartbeatRoom = new HeartbeatRoom(server);
    heartbeatRoom.join(socket);
  });
};

module.exports = heartbeatController;
