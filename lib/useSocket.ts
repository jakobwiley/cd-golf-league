import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketEvents } from './socket';

let socket: Socket | null = null;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize Socket.io connection if not already connected
    if (!socket) {
      // First, initialize the Socket.io server
      fetch('/api/socket')
        .then(() => {
          // Then connect to the server
          socket = io();

          // Set up event handlers
          socket.on('connect', () => {
            console.log('Socket.io connected');
            setIsConnected(true);
          });

          socket.on('disconnect', () => {
            console.log('Socket.io disconnected');
            setIsConnected(false);
          });
        })
        .catch((error) => {
          console.error('Failed to initialize Socket.io server:', error);
        });
    }

    // Clean up on unmount
    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  // Function to subscribe to events
  const subscribe = (event: SocketEvents, callback: (data: any) => void) => {
    if (!socket) return () => {};

    socket.on(event, callback);
    return () => {
      socket.off(event, callback);
    };
  };

  return {
    isConnected,
    subscribe,
    socket,
  };
}; 