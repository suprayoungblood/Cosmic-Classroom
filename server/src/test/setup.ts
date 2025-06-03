import { sequelize } from '../config/database';

// Increase timeout for database operations
jest.setTimeout(30000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Setup before all tests
beforeAll(async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    // Sync database in test mode
    if (process.env.NODE_ENV === 'test') {
      await sequelize.sync({ force: true });
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

// Cleanup after all tests
afterAll(async () => {
  try {
    await sequelize.close();
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
});

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});