import HeartbeatRoom from '../rooms/HeartbeatRoom';
import SocketEvent from '../utils/SocketEvent';

class HeartbeatEvent extends SocketEvent {
  get Name() {
    return 'heartbeat';
  }

  get Room() {
    return HeartbeatRoom;
  }
}

export default HeartbeatEvent;
