// Test utilities and helpers for React component testing
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock data for testing
export const mockTodos = [
  {
    todo_id: 1,
    title: 'Test Todo 1',
    description: 'This is a test todo description',
    priority: 'high',
    category: 'work',
    completed: false,
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    todo_id: 2,
    title: 'Test Todo 2',
    description: 'Another test todo description',
    priority: 'medium',
    category: 'personal',
    completed: false,
    created_at: '2023-01-02T00:00:00Z'
  },
  {
    todo_id: 3,
    title: 'Test Todo 3',
    description: 'Third test todo description',
    priority: 'low',
    category: 'shopping',
    completed: true,
    created_at: '2023-01-03T00:00:00Z'
  }
];

export const mockTodoFormData = {
  title: 'New Test Todo',
  description: 'This is a new test todo',
  priority: 'high',
  category: 'work'
};

// Mock functions for testing
export const mockOnAddTodo = jest.fn();
export const mockOnMarkAsDone = jest.fn();
export const mockOnRefresh = jest.fn();

// Custom render function with providers
export const renderWithProviders = (ui, options = {}) => {
  return render(ui, {
    ...options,
  });
};

// Helper to find elements by test id
export const getByTestId = (testId) => screen.getByTestId(testId);
export const queryByTestId = (testId) => screen.queryByTestId(testId);

// Helper to find elements by role
export const getByRole = (role, options = {}) => screen.getByRole(role, options);
export const getAllByRole = (role, options = {}) => screen.getAllByRole(role, options);

// Helper to find elements by text
export const getByText = (text, options = {}) => screen.getByText(text, options);
export const getAllByText = (text, options = {}) => screen.getAllByText(text, options);

// Helper to find elements by placeholder
export const getByPlaceholderText = (text) => screen.getByPlaceholderText(text);

// Helper to find elements by label
export const getByLabelText = (text) => screen.getByLabelText(text);

// Helper to wait for elements
export const waitForElement = (callback, options = {}) => 
  waitFor(callback, { timeout: 5000, ...options });

// Helper to simulate user interactions
export const user = userEvent.setup();

// Mock API responses
export const mockApiResponses = {
  getAllTodos: {
    success: mockTodos,
    error: new Error('Failed to fetch todos')
  },
  createTodo: {
    success: {
      todo_id: 4,
      ...mockTodoFormData,
      completed: false,
      created_at: new Date().toISOString()
    },
    error: new Error('Failed to create todo')
  },
  deleteTodo: {
    success: { message: 'Todo deleted successfully' },
    error: new Error('Failed to delete todo')
  }
};

// Helper to create mock API functions
export const createMockApi = (responses = mockApiResponses) => ({
  getAllTodos: jest.fn().mockResolvedValue(responses.getAllTodos.success),
  createTodo: jest.fn().mockResolvedValue(responses.createTodo.success),
  deleteTodo: jest.fn().mockResolvedValue(responses.deleteTodo.success)
});

// Helper to create mock API with errors
export const createMockApiWithErrors = () => ({
  getAllTodos: jest.fn().mockRejectedValue(mockApiResponses.getAllTodos.error),
  createTodo: jest.fn().mockRejectedValue(mockApiResponses.createTodo.error),
  deleteTodo: jest.fn().mockRejectedValue(mockApiResponses.deleteTodo.error)
});

// Helper to reset all mocks
export const resetAllMocks = () => {
  jest.clearAllMocks();
  mockOnAddTodo.mockClear();
  mockOnMarkAsDone.mockClear();
  mockOnRefresh.mockClear();
};

// Helper to simulate form submission
export const simulateFormSubmission = async (formData) => {
  const user = userEvent.setup();
  
  // Fill in form fields
  if (formData.title) {
    await user.type(screen.getByLabelText(/todo title/i), formData.title);
  }
  
  if (formData.description) {
    await user.type(screen.getByLabelText(/description/i), formData.description);
  }
  
  if (formData.priority) {
    await user.selectOptions(screen.getByLabelText(/priority/i), formData.priority);
  }
  
  if (formData.category) {
    await user.selectOptions(screen.getByLabelText(/category/i), formData.category);
  }
  
  // Submit form
  await user.click(screen.getByRole('button', { name: /create todo/i }));
};

// Helper to simulate todo interaction
export const simulateMarkAsDone = async (todoId) => {
  const user = userEvent.setup();
  const doneButton = screen.getByRole('button', { name: /done/i });
  await user.click(doneButton);
};

// Helper to simulate search and filtering
export const simulateSearch = async (searchTerm) => {
  const user = userEvent.setup();
  const searchInput = screen.getByPlaceholderText(/search by title or description/i);
  await user.clear(searchInput);
  await user.type(searchInput, searchTerm);
};

export const simulatePriorityFilter = async (priority) => {
  const user = userEvent.setup();
  const prioritySelect = screen.getByLabelText(/filter by priority/i);
  await user.selectOptions(prioritySelect, priority);
};

export const simulateCategoryFilter = async (category) => {
  const user = userEvent.setup();
  const categorySelect = screen.getByLabelText(/filter by category/i);
  await user.selectOptions(categorySelect, category);
};

// Helper to check if element has specific classes
export const hasClass = (element, className) => {
  return element.classList.contains(className);
};

// Helper to check if element has specific styles
export const hasStyle = (element, styleProperty, expectedValue) => {
  const computedStyle = window.getComputedStyle(element);
  return computedStyle[styleProperty] === expectedValue;
};

// Helper to wait for async operations
export const waitForAsync = (ms = 100) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Export all testing utilities
export {
  render,
  screen,
  fireEvent,
  waitFor,
  userEvent
};
