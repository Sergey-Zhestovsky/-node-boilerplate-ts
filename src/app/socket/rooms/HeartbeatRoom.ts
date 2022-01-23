import HeartbeatEvent from '../events/HeartbeatEvent';
import Room from '../utils/Room';

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
