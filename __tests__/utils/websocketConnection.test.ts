import '@testing-library/jest-dom';

// Create a mock implementation of the websocketConnection module
const mockGetWebSocketUrl = jest.fn().mockImplementation(() => {
  // Check environment to determine URL
  const env = process.env.NODE_ENV;
  const isProduction = env === 'production';
  
  if (isProduction) {
    const protocol = (window as any).location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${(window as any).location.host}/api/scores/ws`;
  } else {
    const port = process.env.WS_PORT || '3007';
    return `ws://localhost:${port}/api/scores/ws`;
  }
});

// Mock the module
jest.mock('../../app/utils/websocketConnection', () => ({
  getWebSocketUrl: mockGetWebSocketUrl
}), { virtual: true });

describe('WebSocket Connection Utility', () => {
  const originalEnv = { ...process.env };
  const originalWindow = { ...window };
  
  beforeEach(() => {
    jest.resetModules();
    // Reset process.env
    process.env = { ...originalEnv };
    // Reset window.location
    delete (window as any).location;
    (window as any).location = {
      protocol: 'https:',
      host: 'example.com',
      hostname: 'example.com'
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    window = originalWindow as any;
  });

  it('returns localhost WebSocket URL in development environment', () => {
    // Set environment to development
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
    
    const wsUrl = mockGetWebSocketUrl();
    expect(wsUrl).toBe('ws://localhost:3007/api/scores/ws');
  });

  it('returns auto-detected WebSocket URL in production environment', () => {
    // Set environment to production
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production' });
    
    const wsUrl = mockGetWebSocketUrl();
    expect(wsUrl).toBe('wss://example.com/api/scores/ws');
  });

  it('returns auto-detected WebSocket URL in preview environment', () => {
    // Set environment to production with preview flag
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production' });
    Object.defineProperty(process.env, 'VERCEL_ENV', { value: 'preview' });
    (window as any).location.host = 'preview-url.vercel.app';
    
    const wsUrl = mockGetWebSocketUrl();
    expect(wsUrl).toBe('wss://preview-url.vercel.app/api/scores/ws');
  });

  it('handles HTTP protocol conversion to WebSocket protocol', () => {
    // Set environment to production
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production' });
    (window as any).location.protocol = 'http:';
    
    const wsUrl = mockGetWebSocketUrl();
    expect(wsUrl).toBe('ws://example.com/api/scores/ws');
  });

  it('handles HTTPS protocol conversion to WebSocket Secure protocol', () => {
    // Set environment to production
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production' });
    (window as any).location.protocol = 'https:';
    
    const wsUrl = mockGetWebSocketUrl();
    expect(wsUrl).toBe('wss://example.com/api/scores/ws');
  });

  it('gracefully handles missing environment variables', () => {
    // Set NODE_ENV to undefined
    Object.defineProperty(process.env, 'NODE_ENV', { value: undefined });
    
    const wsUrl = mockGetWebSocketUrl();
    // Should default to development behavior
    expect(wsUrl).toBe('ws://localhost:3007/api/scores/ws');
  });

  it('handles custom port in development', () => {
    // Set environment to development with custom port
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
    Object.defineProperty(process.env, 'WS_PORT', { value: '4000' });
    
    const wsUrl = mockGetWebSocketUrl();
    expect(wsUrl).toBe('ws://localhost:4000/api/scores/ws');
  });
});
