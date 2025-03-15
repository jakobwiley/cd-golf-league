import { NextApiRequest, NextApiResponse } from 'next';
import { SocketEvents } from '../../lib/socket';

// Define the response type with socket server
export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: any & {
      io?: any;
    };
  };
};

// Initialize Socket.io server with dynamic imports
const initSocketServer = async (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io server...');
    
    // Dynamically import socket.io to avoid client-side issues
    const { Server } = await import('socket.io');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    // Set up event handlers
    io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }
  return res.socket.server.io;
};

// Helper function to emit events to all connected clients
export const emitEvent = (io: any, event: SocketEvents, data: any) => {
  console.log(`Emitting ${event} event with data:`, data);
  io.emit(event, data);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  try {
    // Initialize Socket.io server
    const io = await initSocketServer(req, res);
    
    // Store the Socket.io instance globally for access from other API routes
    if (io && typeof global !== 'undefined') {
      (global as any).socketIo = io;
    }
    
    // Return success response
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error initializing Socket.io server:', error);
    res.status(500).json({ error: 'Failed to initialize Socket.io server' });
  }
}

// Configure the API route to disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
}; 