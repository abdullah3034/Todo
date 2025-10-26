// Global test setup
const { setupTestDatabase } = require('./testHelpers');

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'todo_app_test';

// Global test timeout
jest.setTimeout(10000);

// Setup before all tests
beforeAll(async () => {
  console.log('Setting up test environment...');
});

// Cleanup after all tests
afterAll(async () => {
  console.log('Cleaning up test environment...');
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Suppress console.log during tests unless explicitly needed
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeEach(() => {
  // Suppress console output during tests
  console.log = jest.fn();
  console.error = jest.fn();
});

afterEach(() => {
  // Restore console output after tests
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});
