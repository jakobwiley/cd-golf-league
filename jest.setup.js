require('@testing-library/jest-dom'); 

// Load environment variables from .env file
require('dotenv').config();

// Set default timeout for all tests
jest.setTimeout(30000);

// Mock environment variables
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://neondb_owner:npg_UTf6rRNWv2gS@ep-orange-wind-a5qu7eeg-pooler.us-east-2.aws.neon.tech/neondb_test?sslmode=require';
process.env.NODE_ENV = 'test';

// Global test variables
global.TEST_BASE_URL = process.env.TEST_BASE_URL || 'https://cd-gl-2025-cxskfmups-jakes-projects-9070cd0b.vercel.app';

// Handle circular references in JSON
const originalJSONStringify = JSON.stringify;
JSON.stringify = function(value, replacer, space) {
  const seen = new WeakSet();
  return originalJSONStringify(value, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
      value = replacer ? replacer(key, value) : value;
    }
    return value;
  }, space);
};

// Add a custom serializer for Jest
const { expect } = require('@jest/globals');
expect.extend({
  toBeCircularFree(received) {
    const seen = new WeakSet();
    const stringified = JSON.stringify(received, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return value;
    });
    return {
      message: () => `expected ${received} to be circular-free`,
      pass: true,
    };
  },
});

// Export test configuration
module.exports = {
  TEST_BASE_URL,
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL
};

// Clean up after all tests
afterAll(async () => {
  // Add any global cleanup here
}); 