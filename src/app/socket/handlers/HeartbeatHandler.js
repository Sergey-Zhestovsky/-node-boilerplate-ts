const Joi = require('joi');

const HealthService = require('../../../services/HealthService');
const SocketHandler = require('../../utils/socket/SocketHandler');
const HeartbeatEvent = require('../events/HeartbeatEvent');

class HeartbeatHandler extends SocketHandler {
  get Event() {
    return new HeartbeatEvent();
  }

  async handle(payload) {
    const response = await HealthService.getServerStatus(false);
    this.socket.emit(this.Event.Name, response);
  }

  /** @param {Joi} T */
  validator(T) {
    return null;
  }

  guard() {
    return true;
  }
}

module.exports = HeartbeatHandler;
