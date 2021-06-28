import { Socket } from 'socket.io';

const blank = (socket: Socket, next: (err?: Error) => void) => {};

export default [blank];
