require('@testing-library/jest-dom'); 

// Load environment variables from .env file
require('dotenv').config();

// Set default timeout for all tests
jest.setTimeout(30000);

// Mock environment variables for testing
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/neondb_test';
process.env.TEST_BASE_URL = 'http://localhost:3000';
global.TEST_BASE_URL = process.env.TEST_BASE_URL;

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

beforeAll(async () => {
  try {
    // Reset database using db push
    execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
    
    // Run seed script
    await require('./prisma/seed.ts')();
  } catch (error) {
    console.error('Error setting up test database:', error);
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Reset database state between tests
afterEach(async () => {
  try {
    // Clean up data after each test
    await prisma.$transaction([
      prisma.matchScore.deleteMany(),
      prisma.matchPoints.deleteMany(),
      prisma.matchPlayer.deleteMany(),
      prisma.match.deleteMany(),
      prisma.player.deleteMany(),
      prisma.team.deleteMany(),
    ]);
  } catch (error) {
    console.error('Error cleaning up test database:', error);
  }
});

// Export test configuration
module.exports = {
  TEST_BASE_URL: process.env.TEST_BASE_URL,
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
  // Add any other test configuration here
}; 