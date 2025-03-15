import { useEffect, useState } from 'react';
import { SocketEvents } from './socket';

// Use dynamic import for socket.io-client to avoid server-side modules
let socketIOClient: any;
let socket: any = null;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Dynamically import socket.io-client only on the client side
    const loadSocketIO = async () => {
      if (typeof window !== 'undefined') {
        try {
          // Dynamic import to avoid server-side modules
          const { io } = await import('socket.io-client');
          socketIOClient = io;
          
          // Initialize Socket.io connection if not already connected
          if (!socket) {
            // First, initialize the Socket.io server
            await fetch('/api/socket');
            
            // Then connect to the server
            socket = socketIOClient();
            
            // Set up event handlers
            socket.on('connect', () => {
              console.log('Socket.io connected');
              setIsConnected(true);
            });
            
            socket.on('disconnect', () => {
              console.log('Socket.io disconnected');
              setIsConnected(false);
            });
          }
        } catch (error) {
          console.error('Failed to initialize Socket.io client:', error);
        }
      }
    };
    
    loadSocketIO();
    
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