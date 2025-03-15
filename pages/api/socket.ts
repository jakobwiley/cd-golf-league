import { NextApiRequest } from 'next';
import { initSocketServer, NextApiResponseWithSocket } from '../../lib/socket';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  // Initialize Socket.io server
  const io = initSocketServer(req, res);
  
  // Store the Socket.io instance globally for access from other API routes
  if (io && typeof global !== 'undefined') {
    (global as any).socketIo = io;
  }
  
  // Return success response
  res.status(200).json({ success: true });
}

// Configure the API route to disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
}; 