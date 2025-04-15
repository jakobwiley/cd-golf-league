/**
 * Utility function to get the appropriate WebSocket URL based on the environment
 * Handles different environments:
 * - Development: Uses localhost with port 3007
 * - Production/Preview: Auto-detects based on current host
 * - Server-side: Uses NEXT_PUBLIC_VERCEL_URL if available
 */

// WebSocket event types
export enum SocketEvents {
  MATCH_UPDATED = 'match:updated',
  TEAM_UPDATED = 'team:updated',
  PLAYER_UPDATED = 'player:updated',
  SCORE_UPDATED = 'score:updated',
  STANDINGS_UPDATED = 'standings:updated',
}

export function getWebSocketUrl(): string {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    // Server-side rendering
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      return `wss://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/scores/ws`;
    }
    // Default production URL for server-side if no VERCEL_URL is available
    return 'wss://cd-golf-league.vercel.app/api/scores/ws';
  }

  // Check if running on localhost
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocalhost) {
    // In development, use localhost with configurable port
    const port = process.env.NEXT_PUBLIC_WS_PORT || process.env.WS_PORT || '3007';
    return `ws://localhost:${port}/api/scores/ws`;
  } else {
    // In production or preview, derive WebSocket URL from current host
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/api/scores/ws`;
  }
}

/**
 * Creates a WebSocket connection with automatic reconnection
 * @param url WebSocket URL to connect to
 * @param onOpen Callback when connection opens
 * @param onMessage Callback when message is received
 * @param onClose Callback when connection closes
 * @param onError Callback when error occurs
 * @returns WebSocket instance
 */
export function createWebSocketConnection(
  url: string,
  onOpen?: (event: Event) => void,
  onMessage?: (event: MessageEvent) => void,
  onClose?: (event: CloseEvent) => void,
  onError?: (event: Event) => void
): WebSocket {
  const ws = new WebSocket(url);
  
  if (onOpen) ws.onopen = onOpen;
  if (onMessage) ws.onmessage = onMessage;
  if (onClose) ws.onclose = onClose;
  if (onError) ws.onerror = onError;
  
  return ws;
}

/**
 * Safely closes a WebSocket connection
 * @param ws WebSocket instance to close
 */
export function closeWebSocketConnection(ws: WebSocket | null): void {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
}
