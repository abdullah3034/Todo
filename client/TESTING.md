# Frontend Testing Guide

This guide explains how to run unit tests for the React frontend components of the Todo application.

## 🧪 Test Structure

```
client/
├── src/
│   ├── components/
│   │   └── __tests__/
│   │       ├── TodoForm.test.js     # TodoForm component tests
│   │       └── TodoList.test.js     # TodoList component tests
│   ├── services/
│   │   └── __tests__/
│   │       └── api.test.js          # API service tests
│   ├── __tests__/
│   │   └── App.test.js              # Main App component tests
│   ├── testUtils.js                 # Test utilities and helpers
│   └── setupTests.js                # Jest setup configuration
├── package.json                     # Test scripts and dependencies
└── README.md
```

## 🚀 Running Tests

### Install Dependencies
```bash
cd client
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in CI Mode
```bash
npm run test:ci
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## 📊 Test Coverage

### Components Tested

#### 1. TodoForm Component (`TodoForm.test.js`)
- ✅ Form rendering with all input fields
- ✅ User interactions (typing, selecting)
- ✅ Form validation (required fields)
- ✅ Form submission with correct data
- ✅ Loading states during submission
- ✅ Error handling
- ✅ Accessibility features
- ✅ Styling and visual elements

#### 2. TodoList Component (`TodoList.test.js`)
- ✅ Rendering todos when data is provided
- ✅ Empty state when no todos
- ✅ Priority badge styling and display
- ✅ Category badge styling and display
- ✅ User interactions (mark as done)
- ✅ Component structure and styling
- ✅ Animation and hover effects
- ✅ Edge cases (missing properties, long text)

#### 3. App Component (`App.test.js`)
- ✅ Initial rendering and layout
- ✅ Loading states
- ✅ Todo management (CRUD operations)
- ✅ Search and filtering functionality
- ✅ Error handling and display
- ✅ Empty states
- ✅ Component integration
- ✅ Accessibility features

#### 4. API Service (`api.test.js`)
- ✅ API configuration and base URL
- ✅ GET requests (getAllTodos)
- ✅ POST requests (createTodo)
- ✅ PUT requests (updateTodo)
- ✅ DELETE requests (deleteTodo)
- ✅ Error handling (network, server, validation)
- ✅ Concurrent requests
- ✅ Request/response interceptors

## 🛠️ Test Utilities

### Test Helpers (`testUtils.js`)

```javascript
// Mock data
export const mockTodos = [...];
export const mockTodoFormData = {...};

// Mock functions
export const mockOnAddTodo = jest.fn();
export const mockOnMarkAsDone = jest.fn();

// Custom render function
export const renderWithProviders = (ui, options = {}) => {
  return render(ui, { ...options });
};

// Helper functions
export const simulateFormSubmission = async (formData) => {...};
export const simulateSearch = async (searchTerm) => {...};
export const simulateMarkAsDone = async (todoId) => {...};
```

### Mock API Responses
```javascript
export const mockApiResponses = {
  getAllTodos: {
    success: mockTodos,
    error: new Error('Failed to fetch todos')
  },
  createTodo: {
    success: { todo_id: 4, ...mockTodoFormData },
    error: new Error('Failed to create todo')
  }
};
```

## 📋 Test Scenarios

### Component Testing Scenarios

#### TodoForm Tests
- ✅ **Rendering**: Form fields, labels, placeholders, default values
- ✅ **User Input**: Text input, select options, form state updates
- ✅ **Validation**: Required fields, empty form submission
- ✅ **Submission**: Successful creation, loading states, form reset
- ✅ **Error Handling**: API errors, validation errors
- ✅ **Accessibility**: Labels, form structure, button roles

#### TodoList Tests
- ✅ **Data Display**: Todo rendering, priority badges, category badges
- ✅ **Empty State**: No todos message, emoji display
- ✅ **User Actions**: Mark as done functionality
- ✅ **Styling**: CSS classes, hover effects, animations
- ✅ **Edge Cases**: Missing properties, long text handling

#### App Component Tests
- ✅ **Layout**: Header, statistics, search/filter controls
- ✅ **State Management**: Loading, error, empty states
- ✅ **CRUD Operations**: Create, read, delete todos
- ✅ **Filtering**: Search by text, filter by priority/category
- ✅ **Integration**: Component communication, prop passing

#### API Service Tests
- ✅ **HTTP Methods**: GET, POST, PUT, DELETE requests
- ✅ **Configuration**: Base URL, headers, environment variables
- ✅ **Error Handling**: Network errors, server errors, timeouts
- ✅ **Data Handling**: Request/response data, concurrent requests

## 🔧 Configuration

### Jest Configuration (`package.json`)
```json
{
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx}",
      "!src/index.js",
      "!src/reportWebVitals.js",
      "!src/setupTests.js"
    ],
    "coverageDirectory": "coverage",
    "coverageReporters": ["text", "lcov", "html"],
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/src/setupTests.js"]
  }
}
```

### Test Scripts
```json
{
  "scripts": {
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage --watchAll=false",
    "test:ci": "react-scripts test --coverage --watchAll=false --ci",
    "test:watch": "react-scripts test --watchAll"
  }
}
```

## 🎯 Testing Best Practices

### Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names that explain the scenario
- Follow AAA pattern (Arrange, Act, Assert)

### Mocking Strategy
- Mock external dependencies (API calls, modules)
- Use real component interactions when possible
- Clean up mocks between tests

### User-Centric Testing
- Test user interactions, not implementation details
- Focus on what users see and do
- Use `@testing-library/user-event` for realistic interactions

### Accessibility Testing
- Test keyboard navigation
- Verify proper ARIA labels and roles
- Check color contrast and focus indicators

## 📈 Coverage Targets

### Coverage Goals
- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

### Coverage Reports
- **Terminal**: Text summary
- **HTML**: Detailed report in `coverage/lcov-report/index.html`
- **LCOV**: For CI/CD integration

## 🐛 Debugging Tests

### Debug Individual Tests
```bash
# Run specific test file
npm test -- TodoForm.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should create todo"

# Run with verbose output
npm test -- --verbose
```

### Common Issues

#### Test Failures
```bash
# Clear Jest cache
npm test -- --clearCache

# Run tests with no cache
npm test -- --no-cache
```

#### Mock Issues
```bash
# Reset all mocks
jest.clearAllMocks();

# Reset specific mock
mockFunction.mockClear();
```

#### Async Testing
```javascript
// Wait for async operations
await waitFor(() => {
  expect(element).toBeInTheDocument();
});

// Wait for specific time
await new Promise(resolve => setTimeout(resolve, 100));
```

## 📝 Writing New Tests

### Component Test Template
```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentName from '../ComponentName';

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });

  test('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  test('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<ComponentName />);
    
    await user.click(screen.getByRole('button'));
    expect(mockFunction).toHaveBeenCalled();
  });
});
```

### API Test Template
```javascript
import { apiService } from '../apiService';

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should make correct API call', async () => {
    mockAxios.get.mockResolvedValue({ data: mockData });
    
    const result = await apiService.getData();
    
    expect(mockAxios.get).toHaveBeenCalledWith('/endpoint');
    expect(result).toEqual(mockData);
  });
});
```

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
name: Frontend Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd client && npm install
      - run: cd client && npm run test:ci
```

### Coverage Badge
```markdown
![Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)
```

## 🎉 Test Examples

### User Interaction Test
```javascript
test('should create todo when form is submitted', async () => {
  const user = userEvent.setup();
  render(<TodoForm onAddTodo={mockOnAddTodo} />);

  await user.type(screen.getByLabelText(/title/i), 'Test Todo');
  await user.type(screen.getByLabelText(/description/i), 'Test Description');
  await user.click(screen.getByRole('button', { name: /create/i }));

  expect(mockOnAddTodo).toHaveBeenCalledWith({
    title: 'Test Todo',
    description: 'Test Description',
    priority: 'medium',
    category: 'general'
  });
});
```

### Error Handling Test
```javascript
test('should display error message when API fails', async () => {
  todoAPI.getAllTodos.mockRejectedValue(new Error('Network Error'));
  
  render(<App />);
  
  await waitFor(() => {
    expect(screen.getByText(/failed to fetch todos/i)).toBeInTheDocument();
  });
});
```

### Accessibility Test
```javascript
test('should have proper form labels', () => {
  render(<TodoForm />);
  
  expect(screen.getByLabelText(/todo title/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
});
```

---

**Happy Testing! 🧪✨**
