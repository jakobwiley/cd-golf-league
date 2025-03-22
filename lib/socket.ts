import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer;
  };
};

// WebSocket event types
export enum SocketEvents {
  MATCH_UPDATED = 'match:updated',
  TEAM_UPDATED = 'team:updated',
  PLAYER_UPDATED = 'player:updated',
  SCORE_UPDATED = 'score:updated',
  STANDINGS_UPDATED = 'standings:updated',
}

// Get WebSocket URL based on environment
export const getWebSocketUrl = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `wss://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/socket`
  }
  return 'wss://cd-golf-league.vercel.app/api/socket'
}

// Initialize WebSocket connection
export const initWebSocket = () => {
  const wsUrl = getWebSocketUrl()
  console.log('Connecting to WebSocket:', wsUrl)
  
  const ws = new WebSocket(wsUrl)
  
  ws.onopen = () => {
    console.log('WebSocket connected')
  }
  
  ws.onmessage = (event) => {
    try {
      const { event: eventType, data } = JSON.parse(event.data)
      console.log('WebSocket message:', eventType, data)
      
      // Handle different event types
      switch (eventType) {
        case SocketEvents.MATCH_UPDATED:
          // Update match data in UI
          break
        case SocketEvents.SCORE_UPDATED:
          // Update score in UI
          break
        case SocketEvents.STANDINGS_UPDATED:
          // Update standings in UI
          break
        default:
          console.log('Unknown event type:', eventType)
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error)
    }
  }
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
  
  ws.onclose = () => {
    console.log('WebSocket closed, attempting to reconnect...')
    setTimeout(initWebSocket, 1000)
  }
  
  return ws
}

// Helper function to emit events
export const emitEvent = (ws: WebSocket, event: SocketEvents, data: any) => {
  if (ws.readyState === WebSocket.OPEN) {
    console.log(`Emitting ${event} event with data:`, data)
    ws.send(JSON.stringify({ event, data }))
  } else {
    console.warn('WebSocket not connected, message not sent')
  }
}