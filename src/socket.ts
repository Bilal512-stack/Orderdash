import { io } from 'socket.io-client';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const socket = io(BACKEND_URL, {
  transports: ['websocket'],
  path: '/socket.io', // facultatif, sauf si ton backend utilise un path custom
  withCredentials: true,
});

export default socket;
