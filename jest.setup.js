require('@testing-library/jest-dom'); 

// Load environment variables from .env.test
require('dotenv').config({ path: '.env.test' });

// Set default timeout for all tests
jest.setTimeout(30000);

// Mock environment variables for testing
process.env.TEST_BASE_URL = 'http://localhost:3000';
global.TEST_BASE_URL = process.env.TEST_BASE_URL;

// Export test configuration
module.exports = {
  testBaseUrl: process.env.TEST_BASE_URL
};

// Mock Response object
const mockResponse = {
  ok: true,
  status: 200,
  json: jest.fn().mockResolvedValue({}),
  text: jest.fn().mockResolvedValue(''),
};

global.fetch = jest.fn().mockImplementation(() => Promise.resolve(mockResponse));

// Mock WebSocket to avoid circular JSON issues
class MockWebSocket {
  constructor() {
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    
    // Simulate connection
    setTimeout(() => {
      if (this.onopen) this.onopen({ type: 'open' });
    }, 0);
  }

  send(data) {
    // Simulate message echo
    if (this.onmessage) {
      setTimeout(() => {
        this.onmessage({ data });
      }, 0);
    }
  }

  close() {
    if (this.onclose) {
      this.onclose({ type: 'close' });
    }
  }
}

global.WebSocket = MockWebSocket;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    push: jest.fn(),
    prefetch: jest.fn(),
    replace: jest.fn(),
  })),
  useParams: jest.fn(() => ({})),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock next/image
jest.mock('next/image', () => 'img');

// Mock window.screen.orientation
Object.defineProperty(window.screen, 'orientation', {
  writable: true,
  value: {
    type: 'portrait-primary',
    angle: 0,
    lock: jest.fn().mockResolvedValue(undefined),
    unlock: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
});

// Mock requestFullscreen
Element.prototype.requestFullscreen = jest.fn().mockResolvedValue(undefined);
document.exitFullscreen = jest.fn().mockResolvedValue(undefined);

// Suppress console warnings and errors during tests
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.warn = (...args) => {
  if (args[0]?.includes?.('next-route-loader')) return;
  originalConsoleWarn.apply(console, args);
};

console.error = (...args) => {
  if (args[0]?.includes?.('next-route-loader')) return;
  originalConsoleError.apply(console, args);
};