import { Server, Socket } from 'socket.io';

import SocketEvent from './SocketEvent';

const serverPlug = new Server();

class Room {
  static getName(): string {
    return new this(serverPlug).getName();
  }

  static get Events(): Record<string, SocketEvent> {
    return new this(serverPlug).Events;
  }

  private readonly server: Server;

  constructor(server: Server) {
    this.server = server;
  }

  get Events(): Record<string, SocketEvent> {
    return {};
  }

  getName(): string {
    return 'room-name';
  }

  join(socket: Socket) {
    void socket.join(this.getName());
  }

  leave(socket: Socket) {
    void socket.leave(this.getName());
  }

  toRoom(socket?: Socket) {
    if (socket) return socket.to(this.getName());
    return this.server.to(this.getName());
  }
}

export default Room;
