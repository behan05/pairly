import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';

export const socket = io(URL, {
  autoConnect: false,
  transports: ['websocket'],
  auth: (cb) => {
    cb({ token: localStorage.getItem('token') });
  }
});
