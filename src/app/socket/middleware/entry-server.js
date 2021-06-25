const { Socket } = require('socket.io');

/**
 * @param {Socket} socket
 * @param {(err?: Error) => void} next
 */
const blank = (socket, next) => {};

module.exports = [blank];
