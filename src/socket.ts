import { io } from 'socket.io-client';
const BACKEND_URL =
  process.env.REACT_APP_API_URL ||  'https://mta-backend-production-1342.up.railway.app';

const socket = io(BACKEND_URL, {
  transports: ['websocket'],
  path: '/socket.io',
  withCredentials: true,
  secure: BACKEND_URL.startsWith('https'),
  autoConnect: true,
});

export default socket;
