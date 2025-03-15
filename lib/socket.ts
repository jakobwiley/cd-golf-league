import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

// Socket.io event types
export enum SocketEvents {
  MATCH_UPDATED = 'match:updated',
  TEAM_UPDATED = 'team:updated',
  PLAYER_UPDATED = 'player:updated',
  SCORE_UPDATED = 'score:updated',
  STANDINGS_UPDATED = 'standings:updated',
}

// This file only contains shared types and enums
// Server-specific code is moved to pages/api/socket.ts

// Initialize Socket.io server
export const initSocketServer = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io server...');
    const io = new SocketIOServer(res.socket.server);
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
export const emitEvent = (
  io: SocketIOServer,
  event: SocketEvents,
  data: any
) => {
  console.log(`Emitting ${event} event with data:`, data);
  io.emit(event, data);
}; 