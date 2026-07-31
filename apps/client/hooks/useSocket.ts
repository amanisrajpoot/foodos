import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export function useSocket(branchId?: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to the WebSocket Gateway
    const socketInstance = io(SOCKET_URL, {
      query: branchId ? { branchId } : {},
      transports: ['websocket'], // Use WebSocket transport
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [branchId]);

  return { socket, isConnected };
}
