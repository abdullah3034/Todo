import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from '../components/TodoForm';
import { 
  mockOnAddTodo, 
  mockTodoFormData, 
  resetAllMocks,
  simulateFormSubmission,
  user 
} from '../testUtils';

describe('TodoForm Component', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe('Rendering', () => {
    test('should render form with all input fields', () => {
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      // Check if form elements are rendered
      expect(screen.getByText('Add New Todo')).toBeInTheDocument();
      expect(screen.getByLabelText(/todo title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create todo/i })).toBeInTheDocument();
    });

    test('should render form with correct placeholder text', () => {
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Add some details about this task...')).toBeInTheDocument();
    });

    test('should render form with default values', () => {
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      const titleInput = screen.getByLabelText(/todo title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const prioritySelect = screen.getByLabelText(/priority/i);
      const categorySelect = screen.getByLabelText(/category/i);

      expect(titleInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
      expect(prioritySelect).toHaveValue('medium');
      expect(categorySelect).toHaveValue('general');
    });

    test('should render priority options correctly', () => {
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      const prioritySelect = screen.getByLabelText(/priority/i);
      const options = Array.from(prioritySelect.options).map(option => option.value);

      expect(options).toEqual(['low', 'medium', 'high']);
      expect(screen.getByText('🟢 Low Priority')).toBeInTheDocument();
      expect(screen.getByText('🟡 Medium Priority')).toBeInTheDocument();
      expect(screen.getByText('🔴 High Priority')).toBeInTheDocument();
    });

    test('should render category options correctly', () => {
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      const categorySelect = screen.getByLabelText(/category/i);
      const options = Array.from(categorySelect.options).map(option => option.value);

      expect(options).toEqual(['general', 'work', 'personal', 'shopping', 'health', 'learning']);
      expect(screen.getByText('📝 General')).toBeInTheDocument();
      expect(screen.getByText('💼 Work')).toBeInTheDocument();
      expect(screen.getByText('🏠 Personal')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('should update form fields when user types', async () => {
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      const titleInput = screen.getByLabelText(/todo title/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      await user.type(titleInput, 'Test Title');
      await user.type(descriptionInput, 'Test Description');

      expect(titleInput).toHaveValue('Test Title');
      expect(descriptionInput).toHaveValue('Test Description');
    });

    test('should update priority when user selects different option', async () => {
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      const prioritySelect = screen.getByLabelText(/priority/i);
      
      await user.selectOptions(prioritySelect, 'high');
      expect(prioritySelect).toHaveValue('high');

      await user.selectOptions(prioritySelect, 'low');
      expect(prioritySelect).toHaveValue('low');
    });

    test('should update category when user selects different option', async () => {
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      const categorySelect = screen.getByLabelText(/category/i);
      
      await user.selectOptions(categorySelect, 'work');
      expect(categorySelect).toHaveValue('work');

      await user.selectOptions(categorySelect, 'personal');
      expect(categorySelect).toHaveValue('personal');
    });

    test('should clear form after successful submission', async () => {
      mockOnAddTodo.mockResolvedValue({ success: true });
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      const titleInput = screen.getByLabelText(/todo title/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      await user.type(titleInput, 'Test Title');
      await user.type(descriptionInput, 'Test Description');
      
      await simulateFormSubmission({
        title: 'Test Title',
        description: 'Test Description',
        priority: 'medium',
        category: 'general'
      });

      await waitFor(() => {
        expect(titleInput).toHaveValue('');
        expect(descriptionInput).toHaveValue('');
      });
    });
  });

  describe('Form Submission', () => {
    test('should call onAddTodo with correct data when form is submitted', async () => {
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      await simulateFormSubmission(mockTodoFormData);

      expect(mockOnAddTodo).toHaveBeenCalledWith({
        title: mockTodoFormData.title,
        description: mockTodoFormData.description,
        priority: mockTodoFormData.priority,
        category: mockTodoFormData.category
      });
    });

    test('should prevent submission when title is empty', async () => {
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      const descriptionInput = screen.getByLabelText(/description/i);
      await user.type(descriptionInput, 'Test Description');

      const submitButton = screen.getByRole('button', { name: /create todo/i });
      await user.click(submitButton);

      expect(mockOnAddTodo).not.toHaveBeenCalled();
    });

    test('should prevent submission when description is empty', async () => {
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      const titleInput = screen.getByLabelText(/todo title/i);
      await user.type(titleInput, 'Test Title');

      const submitButton = screen.getByRole('button', { name: /create todo/i });
      await user.click(submitButton);

      expect(mockOnAddTodo).not.toHaveBeenCalled();
    });

    test('should prevent submission when both title and description are empty', async () => {
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      const submitButton = screen.getByRole('button', { name: /create todo/i });
      await user.click(submitButton);

      expect(mockOnAddTodo).not.toHaveBeenCalled();
    });

    test('should show loading state during submission', async () => {
      // Mock a delayed response
      mockOnAddTodo.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
      );

      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      await simulateFormSubmission(mockTodoFormData);

      // Check if loading state is shown
      expect(screen.getByText('Creating Magic...')).toBeInTheDocument();
      
      // Check if button is disabled during submission
      const submitButton = screen.getByRole('button', { name: /creating magic/i });
      expect(submitButton).toBeDisabled();

      // Wait for submission to complete
      await waitFor(() => {
        expect(screen.getByText('Create Todo')).toBeInTheDocument();
      });
    });

    test('should disable form fields during submission', async () => {
      mockOnAddTodo.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
      );

      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      await simulateFormSubmission(mockTodoFormData);

      // Check if form fields are disabled during submission
      expect(screen.getByLabelText(/todo title/i)).toBeDisabled();
      expect(screen.getByLabelText(/description/i)).toBeDisabled();
      expect(screen.getByLabelText(/priority/i)).toBeDisabled();
      expect(screen.getByLabelText(/category/i)).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    test('should handle onAddTodo errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockOnAddTodo.mockRejectedValue(new Error('API Error'));

      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      await simulateFormSubmission(mockTodoFormData);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error adding todo:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    test('should show alert when validation fails', async () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      const submitButton = screen.getByRole('button', { name: /create todo/i });
      await user.click(submitButton);

      expect(alertSpy).toHaveBeenCalledWith('Please fill in both title and description');

      alertSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    test('should have proper labels for all form fields', () => {
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      expect(screen.getByLabelText(/todo title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    });

    test('should have proper form structure', () => {
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
    });

    test('should have proper button roles', () => {
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      const submitButton = screen.getByRole('button', { name: /create todo/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    test('should have proper input types', () => {
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      const titleInput = screen.getByLabelText(/todo title/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      expect(titleInput).toHaveAttribute('type', 'text');
      expect(descriptionInput).toHaveAttribute('rows', '4');
    });
  });

  describe('Styling and Visual Elements', () => {
    test('should render with correct CSS classes', () => {
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      const form = screen.getByRole('form');
      expect(form).toHaveClass('space-y-6');

      const submitButton = screen.getByRole('button', { name: /create todo/i });
      expect(submitButton).toHaveClass('group');
    });

    test('should render emoji icons correctly', () => {
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      expect(screen.getByText('✨')).toBeInTheDocument();
      expect(screen.getByText('📝')).toBeInTheDocument();
      expect(screen.getByText('📋')).toBeInTheDocument();
      expect(screen.getByText('⚡')).toBeInTheDocument();
      expect(screen.getByText('🏷️')).toBeInTheDocument();
    });

    test('should render gradient text correctly', () => {
      render(<TodoForm onAddTodo={mockOnAddTodo} />);

      const title = screen.getByText('Add New Todo');
      expect(title).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-teal-600');
    });
  });
});
