require('@testing-library/jest-dom'); 

// Load environment variables from .env file
require('dotenv').config();

// Set default timeout for all tests
jest.setTimeout(10000);

// Global test configuration
const TEST_BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3007';
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;

// Export test configuration
module.exports = {
  TEST_BASE_URL,
  TEST_DATABASE_URL
};

// Clean up after all tests
afterAll(async () => {
  // Add any global cleanup here
}); 