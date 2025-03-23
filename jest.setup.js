require('@testing-library/jest-dom'); 

// Load environment variables from .env.test
require('dotenv').config({ path: '.env.test' });

// Set default timeout for all tests
jest.setTimeout(30000);

// Mock environment variables for testing
process.env.TEST_BASE_URL = 'http://localhost:3000';
global.TEST_BASE_URL = process.env.TEST_BASE_URL;

// Mock Supabase
jest.mock('@supabase/supabase-js', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    data: [],
    error: null,
    then: jest.fn((callback) => Promise.resolve(callback({ data: [], error: null }))),
    catch: jest.fn(),
    subscribe: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnValue({
        subscribe: jest.fn().mockReturnValue({
          unsubscribe: jest.fn()
        })
      })
    }),
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null })
    },
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn(),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/image.jpg' } })
      })
    },
    realtime: {
      channel: jest.fn().mockReturnValue({
        on: jest.fn().mockReturnThis(),
        subscribe: jest.fn().mockImplementation((callback) => {
          callback();
          return {
            unsubscribe: jest.fn()
          };
        })
      })
    }
  };

  return {
    createClient: jest.fn().mockReturnValue(mockSupabase)
  };
});

// Mock lib/supabase.ts
jest.mock('./lib/supabase', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    data: [],
    error: null,
    then: jest.fn((callback) => Promise.resolve(callback({ data: [], error: null }))),
    catch: jest.fn(),
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null })
    },
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn(),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/image.jpg' } })
      })
    },
    realtime: {
      channel: jest.fn().mockReturnValue({
        on: jest.fn().mockReturnThis(),
        subscribe: jest.fn().mockImplementation((callback) => {
          callback();
          return {
            unsubscribe: jest.fn()
          };
        })
      })
    }
  };

  return {
    supabase: mockSupabase,
    createClient: jest.fn().mockReturnValue(mockSupabase)
  };
}, { virtual: true });

// Set Supabase environment variables for testing
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.com';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

// Mock fetch
global.fetch = jest.fn().mockImplementation((url) => {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ success: true, data: [] }),
    text: () => Promise.resolve('{}')
  });
});

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