require('@testing-library/jest-dom'); 

// Load environment variables from .env.test
require('dotenv').config({ path: '.env.test' });

// Set default timeout for all tests
jest.setTimeout(30000);

// Mock environment variables for testing
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/neondb_test';
process.env.TEST_BASE_URL = 'http://localhost:3000';
global.TEST_BASE_URL = process.env.TEST_BASE_URL;

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    team: {
      create: jest.fn().mockImplementation((data) => {
        return Promise.resolve({
          id: 'test-team-id',
          name: data.data.name,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }),
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    player: {
      create: jest.fn().mockImplementation((data) => {
        return Promise.resolve({
          id: 'test-player-id',
          name: data.data.name,
          handicapIndex: parseFloat(data.data.handicapIndex),
          teamId: data.data.teamId,
          playerType: data.data.playerType || 'PRIMARY',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }),
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    match: {
      create: jest.fn().mockResolvedValue({}),
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    matchScore: {
      create: jest.fn().mockResolvedValue({}),
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    matchPoints: {
      create: jest.fn().mockResolvedValue({}),
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    matchPlayer: {
      create: jest.fn().mockResolvedValue({}),
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    playerSubstitution: {
      create: jest.fn().mockResolvedValue({}),
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    $transaction: jest.fn().mockImplementation((operations) => {
      if (Array.isArray(operations)) {
        return Promise.all(operations);
      }
      return operations();
    }),
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    prisma: mockPrismaClient,
  };
});

// Mock HTTP requests
const mockResponse = {
  status: 200,
  body: {},
  ok: true,
  json: () => Promise.resolve({}),
  text: () => Promise.resolve('')
};

global.fetch = jest.fn().mockImplementation(() => Promise.resolve(mockResponse));

// Mock supertest
const mockRequest = jest.fn().mockReturnThis();
mockRequest.get = jest.fn().mockResolvedValue({ status: 200, body: {} });
mockRequest.post = jest.fn().mockResolvedValue({ status: 201, body: {} });
mockRequest.put = jest.fn().mockResolvedValue({ status: 200, body: {} });
mockRequest.delete = jest.fn().mockResolvedValue({ status: 200, body: {} });
mockRequest.send = jest.fn().mockReturnThis();
mockRequest.set = jest.fn().mockReturnThis();
mockRequest.expect = jest.fn().mockReturnThis();

jest.mock('supertest', () => ({
  __esModule: true,
  default: mockRequest,
  Response: class {}
}));

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
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage({ data, type: 'message' });
      }
    }, 0);
  }

  close() {
    if (this.onclose) {
      this.onclose({ type: 'close' });
    }
  }
}

global.WebSocket = MockWebSocket;

// Mock the next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn()
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null)
    };
  },
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Suppress console warnings and errors during tests
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

beforeAll(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});

// Export test configuration
module.exports = {
  testDatabaseUrl: process.env.TEST_DATABASE_URL,
  testBaseUrl: process.env.TEST_BASE_URL,
  // Add any other test configuration here
}; 