import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function useSocket(url: string) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket = io(url);

    socket.on('connect', () => {
      setConnected(true);
      console.log('🔌 Socket connecté', socket?.id);
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('❌ Socket déconnecté');
    });

    return () => {
      socket?.disconnect();
    };
  }, [url]);

  return { socket, connected };
}
