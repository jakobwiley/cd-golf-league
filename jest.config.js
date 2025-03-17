/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 30000,
  verbose: true,
  maxWorkers: 1,
  workerIdleMemoryLimit: '512MB',
  testEnvironmentOptions: {
    url: 'https://cd-gl-2025-cxskfmups-jakes-projects-9070cd0b.vercel.app',
    customExportConditions: ['node', 'node-addons'],
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  // Run tests serially to avoid database conflicts
  maxConcurrency: 1,
  // Add a custom test environment
  testEnvironment: 'node'
}; 