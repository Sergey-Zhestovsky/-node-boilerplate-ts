import Joi from 'joi';

import HealthService from '../../../services/HealthService';
import SocketHandler from '../../utils/socket/SocketHandler';
import HeartbeatEvent from '../events/HeartbeatEvent';

class HeartbeatHandler extends SocketHandler {
  get Event() {
    return new HeartbeatEvent();
  }

  handle() {
    const response = HealthService.getServerStatus(false);
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
