import Room from '../../utils/socket/Room';
import HeartbeatEvent from '../events/HeartbeatEvent';

class HeartbeatRoom extends Room {
  getName() {
    return 'room:heartbeat';
  }

  get Events() {
    return {
      heartbeat: new HeartbeatEvent(),
    };
  }
}

export default HeartbeatRoom;
