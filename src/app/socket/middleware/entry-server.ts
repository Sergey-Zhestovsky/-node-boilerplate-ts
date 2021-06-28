import { Socket } from 'socket.io';

const blank = (socket: Socket, next: (err?: Error) => void) => {};

module.exports = [blank];
