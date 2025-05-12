import { io } from 'socket.io-client';

import { backendUrl } from '../constants/constants';

export const socket = io(backendUrl, {
  transports: ['websocket'],
});
