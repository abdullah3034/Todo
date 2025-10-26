import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { todoAPI } from '../services/api';
import { 
  mockTodos, 
  mockTodoFormData, 
  mockApiResponses,
  resetAllMocks,
  user 
} from '../testUtils';

// Mock the API service
jest.mock('../services/api', () => ({
  todoAPI: {
    getAllTodos: jest.fn(),
    createTodo: jest.fn(),
    deleteTodo: jest.fn()
  }
}));

describe('App Component', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe('Initial Rendering', () => {
    test('should render app title and description', () => {
      todoAPI.getAllTodos.mockResolvedValue([]);
      render(<App />);

      expect(screen.getByText('Todo Master')).toBeInTheDocument();
      expect(screen.getByText('Transform your productivity with our beautiful and intuitive todo management system')).toBeInTheDocument();
    });

    test('should render statistics dashboard', () => {
      todoAPI.getAllTodos.mockResolvedValue([]);
      render(<App />);

      expect(screen.getByText('Total Todos')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('should render search and filter controls', () => {
      todoAPI.getAllTodos.mockResolvedValue([]);
      render(<App />);

      expect(screen.getByPlaceholderText('Search by title or description...')).toBeInTheDocument();
      expect(screen.getByLabelText(/filter by priority/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/filter by category/i)).toBeInTheDocument();
    });

    test('should render TodoForm and TodoList components', () => {
      todoAPI.getAllTodos.mockResolvedValue([]);
      render(<App />);

      expect(screen.getByText('Add New Todo')).toBeInTheDocument();
      expect(screen.getByText('Your Todos')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    test('should show loading spinner when fetching todos', async () => {
      // Mock a delayed response
      todoAPI.getAllTodos.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve([]), 100))
      );

      render(<App />);

      expect(screen.getByText('Loading your todos...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create todo/i })).toBeInTheDocument();
    });

    test('should hide loading spinner after todos are loaded', async () => {
      todoAPI.getAllTodos.mockResolvedValue([]);
      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText('Loading your todos...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Todo Management', () => {
    test('should fetch and display todos on mount', async () => {
      todoAPI.getAllTodos.mockResolvedValue(mockTodos);
      render(<App />);

      await waitFor(() => {
        expect(todoAPI.getAllTodos).toHaveBeenCalledTimes(1);
      });

      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 3')).toBeInTheDocument();
    });

    test('should update total todos count', async () => {
      todoAPI.getAllTodos.mockResolvedValue(mockTodos);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument();
      });
    });

    test('should add new todo successfully', async () => {
      const newTodo = { todo_id: 4, ...mockTodoFormData, completed: false };
      todoAPI.getAllTodos.mockResolvedValue(mockTodos);
      todoAPI.createTodo.mockResolvedValue(newTodo);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      });

      // Fill and submit form
      const titleInput = screen.getByLabelText(/todo title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      
      await user.type(titleInput, mockTodoFormData.title);
      await user.type(descriptionInput, mockTodoFormData.description);
      await user.click(screen.getByRole('button', { name: /create todo/i }));

      await waitFor(() => {
        expect(todoAPI.createTodo).toHaveBeenCalledWith({
          title: mockTodoFormData.title,
          description: mockTodoFormData.description,
          priority: 'medium',
          category: 'general'
        });
      });
    });

    test('should mark todo as done successfully', async () => {
      todoAPI.getAllTodos.mockResolvedValue(mockTodos);
      todoAPI.deleteTodo.mockResolvedValue({ message: 'Todo deleted successfully' });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      });

      const doneButtons = screen.getAllByRole('button', { name: /done/i });
      await user.click(doneButtons[0]);

      await waitFor(() => {
        expect(todoAPI.deleteTodo).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('Search and Filtering', () => {
    beforeEach(async () => {
      todoAPI.getAllTodos.mockResolvedValue(mockTodos);
      render(<App />);
      await waitFor(() => {
        expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      });
    });

    test('should filter todos by search term', async () => {
      const searchInput = screen.getByPlaceholderText('Search by title or description...');
      
      await user.type(searchInput, 'Test Todo 1');

      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Todo 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Todo 3')).not.toBeInTheDocument();
    });

    test('should filter todos by priority', async () => {
      const prioritySelect = screen.getByLabelText(/filter by priority/i);
      
      await user.selectOptions(prioritySelect, 'high');

      expect(screen.getByText('Test Todo 1')).toBeInTheDocument(); // High priority
      expect(screen.queryByText('Test Todo 2')).not.toBeInTheDocument(); // Medium priority
      expect(screen.queryByText('Test Todo 3')).not.toBeInTheDocument(); // Low priority
    });

    test('should filter todos by category', async () => {
      const categorySelect = screen.getByLabelText(/filter by category/i);
      
      await user.selectOptions(categorySelect, 'work');

      expect(screen.getByText('Test Todo 1')).toBeInTheDocument(); // Work category
      expect(screen.queryByText('Test Todo 2')).not.toBeInTheDocument(); // Personal category
      expect(screen.queryByText('Test Todo 3')).not.toBeInTheDocument(); // Shopping category
    });

    test('should combine search and filter criteria', async () => {
      const searchInput = screen.getByPlaceholderText('Search by title or description...');
      const prioritySelect = screen.getByLabelText(/filter by priority/i);
      
      await user.type(searchInput, 'Test');
      await user.selectOptions(prioritySelect, 'high');

      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Todo 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Todo 3')).not.toBeInTheDocument();
    });

    test('should show filtered count', async () => {
      const searchInput = screen.getByPlaceholderText('Search by title or description...');
      
      await user.type(searchInput, 'Test Todo 1');

      expect(screen.getByText('1 found')).toBeInTheDocument();
    });

    test('should clear filters and show all todos', async () => {
      const searchInput = screen.getByPlaceholderText('Search by title or description...');
      const prioritySelect = screen.getByLabelText(/filter by priority/i);
      
      // Apply filters
      await user.type(searchInput, 'Test Todo 1');
      await user.selectOptions(prioritySelect, 'high');

      // Clear filters
      await user.clear(searchInput);
      await user.selectOptions(prioritySelect, 'all');

      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 3')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('should display error message when fetch fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      todoAPI.getAllTodos.mockRejectedValue(new Error('Network Error'));

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch todos. Please check if the server is running.')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    test('should display error message when create todo fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      todoAPI.getAllTodos.mockResolvedValue([]);
      todoAPI.createTodo.mockRejectedValue(new Error('Create Error'));

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Add New Todo')).toBeInTheDocument();
      });

      // Try to create a todo
      const titleInput = screen.getByLabelText(/todo title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      
      await user.type(titleInput, 'Test Todo');
      await user.type(descriptionInput, 'Test Description');
      await user.click(screen.getByRole('button', { name: /create todo/i }));

      await waitFor(() => {
        expect(screen.getByText('Failed to create todo. Please try again.')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    test('should display error message when delete todo fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      todoAPI.getAllTodos.mockResolvedValue(mockTodos);
      todoAPI.deleteTodo.mockRejectedValue(new Error('Delete Error'));

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      });

      const doneButtons = screen.getAllByRole('button', { name: /done/i });
      await user.click(doneButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Failed to mark todo as done. Please try again.')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    test('should hide error message after successful operation', async () => {
      todoAPI.getAllTodos.mockRejectedValueOnce(new Error('Network Error'))
        .mockResolvedValueOnce(mockTodos);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch todos. Please check if the server is running.')).toBeInTheDocument();
      });

      // Simulate retry by calling fetchTodos again
      const retryButton = screen.getByRole('button', { name: /create todo/i });
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.queryByText('Failed to fetch todos. Please check if the server is running.')).not.toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    test('should show empty state when no todos exist', async () => {
      todoAPI.getAllTodos.mockResolvedValue([]);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('No todos yet')).toBeInTheDocument();
        expect(screen.getByText('Your productivity journey starts here! Create your first todo and watch the magic happen.')).toBeInTheDocument();
      });
    });

    test('should show empty state when all todos are filtered out', async () => {
      todoAPI.getAllTodos.mockResolvedValue(mockTodos);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search by title or description...');
      await user.type(searchInput, 'Non-existent todo');

      expect(screen.getByText('No todos yet')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    test('should pass correct props to TodoForm', async () => {
      todoAPI.getAllTodos.mockResolvedValue([]);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Add New Todo')).toBeInTheDocument();
      });

      // Verify TodoForm is rendered with correct props
      const titleInput = screen.getByLabelText(/todo title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      
      expect(titleInput).toBeInTheDocument();
      expect(descriptionInput).toBeInTheDocument();
    });

    test('should pass correct props to TodoList', async () => {
      todoAPI.getAllTodos.mockResolvedValue(mockTodos);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      });

      // Verify TodoList is rendered with correct props
      const doneButtons = screen.getAllByRole('button', { name: /done/i });
      expect(doneButtons).toHaveLength(3);
    });

    test('should limit displayed todos to 5', async () => {
      const manyTodos = Array.from({ length: 10 }, (_, i) => ({
        todo_id: i + 1,
        title: `Todo ${i + 1}`,
        description: `Description ${i + 1}`,
        priority: 'medium',
        category: 'general',
        completed: false
      }));

      todoAPI.getAllTodos.mockResolvedValue(manyTodos);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Todo 1')).toBeInTheDocument();
      });

      // Should only show first 5 todos
      expect(screen.getByText('Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Todo 2')).toBeInTheDocument();
      expect(screen.getByText('Todo 3')).toBeInTheDocument();
      expect(screen.getByText('Todo 4')).toBeInTheDocument();
      expect(screen.getByText('Todo 5')).toBeInTheDocument();
      expect(screen.queryByText('Todo 6')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper heading structure', async () => {
      todoAPI.getAllTodos.mockResolvedValue([]);
      render(<App />);

      expect(screen.getByRole('heading', { level: 1, name: 'Todo Master' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Add New Todo' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Your Todos' })).toBeInTheDocument();
    });

    test('should have proper form labels', async () => {
      todoAPI.getAllTodos.mockResolvedValue([]);
      render(<App />);

      expect(screen.getByLabelText(/todo title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    });

    test('should have proper button roles', async () => {
      todoAPI.getAllTodos.mockResolvedValue([]);
      render(<App />);

      expect(screen.getByRole('button', { name: /create todo/i })).toBeInTheDocument();
    });
  });
});
