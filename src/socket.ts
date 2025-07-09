import { io } from 'socket.io-client';

// En prod (Vercel), REACT_APP_API_URL doit être une URL HTTPS valide Railway
const BACKEND_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

const socket = io(BACKEND_URL, {
  transports: ['websocket'],
  path: '/socket.io',
  withCredentials: true,
  secure: BACKEND_URL.startsWith('https'),
  autoConnect: true,
});

export default socket;
