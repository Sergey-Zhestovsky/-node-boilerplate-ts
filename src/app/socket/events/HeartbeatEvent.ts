import { Server } from 'socket.io';

import SocketEvent from '../../utils/socket/SocketEvent';
import HeartbeatRoom from '../rooms/HeartbeatRoom';

class HeartbeatEvent extends SocketEvent {
  get Name() {
    return 'heartbeat';
  }

  get Room() {
    return HeartbeatRoom;
  }
}

export default HeartbeatEvent;
