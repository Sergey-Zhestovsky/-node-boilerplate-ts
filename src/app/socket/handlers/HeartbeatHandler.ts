import Joi from 'joi';
import { Server, Socket } from 'socket.io';

import { HealthService } from '@/services/HealthService';

import HeartbeatEvent from '../events/HeartbeatEvent';
import SocketHandler from '../utils/SocketHandler';

class HeartbeatHandler extends SocketHandler {
  private readonly healthService: HealthService;

  constructor(server: Server, socket: Socket) {
    super(server, socket);
    this.healthService = new HealthService();
  }

  get Event() {
    return new HeartbeatEvent();
  }

  handle() {
    const response = this.healthService.getServerStatus(false);
    this.socket.emit(this.Event.Name, response);
  }

  validator(T: Joi.Root) {
    return null;
  }

  guard() {
    return true;
  }
}

export default HeartbeatHandler;
