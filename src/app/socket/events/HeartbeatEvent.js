const SocketEvent = require('../../utils/socket/SocketEvent');
const HeartbeatRoom = require('../rooms/HeartbeatRoom');

class HeartbeatEvent extends SocketEvent {
  get Name() {
    return 'heartbeat';
  }

  get Room() {
    return new HeartbeatRoom();
  }
}

module.exports = HeartbeatEvent;
