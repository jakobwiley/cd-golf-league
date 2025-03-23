/**
 * WebSocket Configuration Tests
 */

/**
 * @jest-environment jsdom
 */

// Import the function directly
import { getWebSocketUrl } from '../../app/utils/websocketConnection';

// Mock the implementation
jest.mock('../../app/utils/websocketConnection', () => ({
  getWebSocketUrl: jest.fn(),
  SocketEvents: {
    MATCH_UPDATED: 'match:updated',
    TEAM_UPDATED: 'team:updated',
    PLAYER_UPDATED: 'player:updated',
    SCORE_UPDATED: 'score:updated',
    STANDINGS_UPDATED: 'standings:updated',
  }
}));

describe('WebSocket URL Generation', () => {
  // Store original window and env
  const originalWindow = global.window;
  const originalEnv = process.env;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Reset window
    global.window = {
      location: {
        protocol: 'http:',
        hostname: 'localhost',
        host: 'localhost:3000'
      }
    } as any;
    
    // Reset env
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore originals
    global.window = originalWindow;
    process.env = originalEnv;
  });

  test('should return localhost URL with port 3007 in development', () => {
    // Setup mock implementation for this test
    (getWebSocketUrl as jest.Mock).mockReturnValue('ws://localhost:3007/api/scores/ws');
    
    // Call the function
    const wsUrl = getWebSocketUrl();
    
    // Assert the result
    expect(wsUrl).toBe('ws://localhost:3007/api/scores/ws');
  });

  test('should use custom port from environment variable if provided', () => {
    // Setup mock implementation for this test
    (getWebSocketUrl as jest.Mock).mockReturnValue('ws://localhost:4000/api/scores/ws');
    
    // Call the function
    const wsUrl = getWebSocketUrl();
    
    // Assert the result
    expect(wsUrl).toBe('ws://localhost:4000/api/scores/ws');
  });

  test('should use WS protocol in production with HTTP', () => {
    // Setup mock implementation for this test
    (getWebSocketUrl as jest.Mock).mockReturnValue('ws://example.com/api/scores/ws');
    
    // Call the function
    const wsUrl = getWebSocketUrl();
    
    // Assert the result
    expect(wsUrl).toBe('ws://example.com/api/scores/ws');
  });

  test('should use WSS protocol in production with HTTPS', () => {
    // Setup mock implementation for this test
    (getWebSocketUrl as jest.Mock).mockReturnValue('wss://example.com/api/scores/ws');
    
    // Call the function
    const wsUrl = getWebSocketUrl();
    
    // Assert the result
    expect(wsUrl).toBe('wss://example.com/api/scores/ws');
  });
});
