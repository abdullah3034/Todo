# Backend Testing Guide

This guide explains how to run unit tests and integration tests for the Todo application backend.

## 🧪 Test Structure

```
server/
├── test/
│   ├── unit/                 # Unit tests
│   │   ├── db.test.js        # Database connection tests
│   │   └── routes.test.js    # Route handler tests
│   ├── integration/          # Integration tests
│   │   └── api.test.js       # Full API endpoint tests
│   ├── testHelpers.js        # Test utilities and helpers
│   └── setup.js              # Global test setup
├── testDb.js                 # Test database configuration
├── jest.config.js            # Jest configuration
└── package.json              # Test scripts and dependencies
```

## 🚀 Running Tests

### Install Dependencies
```bash
cd server
npm install
```

### Run All Tests
```bash
npm test
```

### Run Specific Test Types
```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Watch mode (re-runs tests on file changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📊 Test Types

### 1. Unit Tests (`test/unit/`)

**Purpose**: Test individual functions and components in isolation

#### Database Tests (`db.test.js`)
- Database connection configuration
- Query operations (SELECT, INSERT, UPDATE, DELETE)
- Error handling
- Environment variable usage

#### Route Handler Tests (`routes.test.js`)
- Individual route handler functions
- Request/response handling
- Error scenarios
- Mock database interactions

### 2. Integration Tests (`test/integration/`)

**Purpose**: Test complete API endpoints with real database interactions

#### API Tests (`api.test.js`)
- Full CRUD operations workflow
- HTTP status codes
- Response formats
- Error handling
- CORS headers
- Complete user scenarios

## 🛠️ Test Utilities

### Test Helpers (`testHelpers.js`)

```javascript
// Test data
const testTodos = {
  validTodo: { title: 'Test Todo', description: 'Test Description', priority: 'high', category: 'testing' },
  minimalTodo: { title: 'Minimal Todo', description: 'Minimal Description' },
  invalidTodo: { description: 'Missing title' }
};

// Database helpers
await setupTestDatabase();     // Create test tables
await cleanupTestDatabase();   // Clear test data
await insertTestTodo(data);    // Insert test todo

// Mock helpers
const mockReq = createMockRequest(params, body, query);
const mockRes = createMockResponse();
const mockPool = createMockPool(mockQuery);
```

### Test Database (`testDb.js`)
- Separate test database configuration
- Uses `todo_app_test` database
- Environment variable support

## 📋 Test Scenarios

### Unit Test Scenarios

#### Database Tests
- ✅ Correct connection configuration
- ✅ Environment variable usage
- ✅ Successful queries
- ✅ Query with parameters
- ✅ Error handling

#### Route Handler Tests
- ✅ Create todo with all fields
- ✅ Create todo with defaults
- ✅ Database error handling
- ✅ Get all todos
- ✅ Get single todo
- ✅ Update todo
- ✅ Delete todo

### Integration Test Scenarios

#### API Endpoint Tests
- ✅ POST /todos - Create new todo
- ✅ GET /todos - Get all todos
- ✅ GET /todos/:id - Get single todo
- ✅ PUT /todos/:id - Update todo
- ✅ DELETE /todos/:id - Delete todo

#### Error Handling Tests
- ✅ Invalid data validation
- ✅ Non-existent resource handling
- ✅ Malformed JSON requests
- ✅ Database connection errors

#### Complete Workflow Tests
- ✅ Full CRUD operations sequence
- ✅ Data persistence verification
- ✅ CORS header validation

## 🔧 Configuration

### Jest Configuration (`jest.config.js`)
```javascript
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testMatch: ['<rootDir>/test/**/*.test.js'],
  collectCoverageFrom: ['**/*.js', '!**/node_modules/**', '!**/test/**'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  testTimeout: 10000
};
```

### Package.json Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration"
  }
}
```

## 🐳 Docker Testing

### Test Database Setup
```bash
# Create test database
docker exec -it todo-database psql -U postgres -c "CREATE DATABASE todo_app_test;"

# Run tests with Docker
docker-compose exec backend npm test
```

### Environment Variables
```bash
# Test environment
NODE_ENV=test
DB_NAME=todo_app_test
DB_HOST=database
DB_USER=postgres
DB_PASSWORD=Dita8220#
```

## 📈 Coverage Reports

### Generate Coverage Report
```bash
npm run test:coverage
```

### Coverage Output
- **Text**: Terminal output
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info`

### Coverage Targets
- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

## 🐛 Debugging Tests

### Debug Individual Tests
```bash
# Run specific test file
npm test -- db.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should create todo"

# Verbose output
npm test -- --verbose
```

### Common Issues

#### Database Connection Errors
```bash
# Check if PostgreSQL is running
docker-compose ps

# Check database logs
docker-compose logs database
```

#### Test Timeout Issues
```bash
# Increase timeout in jest.config.js
testTimeout: 30000
```

#### Port Conflicts
```bash
# Kill processes using test ports
npx kill-port 5000 5432
```

## 📝 Writing New Tests

### Unit Test Template
```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  test('should do something', async () => {
    // Arrange
    const input = 'test data';
    
    // Act
    const result = await functionUnderTest(input);
    
    // Assert
    expect(result).toBe(expectedOutput);
  });
});
```

### Integration Test Template
```javascript
describe('API Endpoint', () => {
  beforeEach(async () => {
    await cleanupTestDatabase();
  });

  test('should handle request', async () => {
    const response = await request(app)
      .post('/endpoint')
      .send(testData)
      .expect(200);

    expect(response.body).toMatchObject(expectedData);
  });
});
```

## 🎯 Best Practices

### Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Mocking
- Mock external dependencies
- Use real database for integration tests
- Clean up mocks after each test

### Data Management
- Use test-specific data
- Clean up test data between tests
- Use factories for test data creation

### Error Testing
- Test both success and error scenarios
- Verify error messages and status codes
- Test edge cases and boundary conditions

---

**Happy Testing! 🧪✨**
