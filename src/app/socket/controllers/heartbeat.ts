import { Server } from 'socket.io';

import HeartbeatRoom from '../rooms/HeartbeatRoom';

const heartbeatController = (server: Server) => {
  server.on('connect', (socket) => {
    const heartbeatRoom = new HeartbeatRoom(server);
    heartbeatRoom.join(socket);
  });
};

export default heartbeatController;
