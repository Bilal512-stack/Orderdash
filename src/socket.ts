import { io } from 'socket.io-client';

// Utiliser la même variable d'environnement (sans /api)
const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://mta-backend-production-1342.up.railway.app';

console.log("✅ BACKEND_URL (socket.ts):", BACKEND_URL);

const socket = io(BACKEND_URL, {
  transports: ['websocket'],
  withCredentials: true,
  // path: '/socket.io' // optionnel, si pas custom sur le backend
});

export default socket;
