/* eslint-disable @typescript-eslint/member-ordering */

import { Server } from 'socket.io';

import Room from './Room';

class SocketEvent {
  static get Name(): string {
    return new this().Name;
  }

  static getName(): string {
    return new this().Name;
  }

  get Name(): string {
    return 'socket-event';
  }

  getName(): string {
    return this.Name;
  }

  static get Room(): typeof Room | null {
    return new this().Room;
  }

  static getRoom(server: Server): Room | null {
    return new this().getRoom(server);
  }

  get Room(): typeof Room | null {
    return null;
  }

  getRoom(server: Server): Room | null {
    const EventRoom = this.Room;
    return EventRoom ? new EventRoom(server) : null;
  }

  toString(): string {
    return this.Name;
  }

  valueOf(): string {
    return this.Name;
  }
}

export default SocketEvent;
