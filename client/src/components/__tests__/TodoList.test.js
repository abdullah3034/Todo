import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoList from '../TodoList';
import { 
  mockTodos, 
  mockOnMarkAsDone, 
  mockOnRefresh,
  resetAllMocks,
  user 
} from '../testUtils';

describe('TodoList Component', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe('Rendering with Todos', () => {
    test('should render todos when todos array is provided', () => {
      render(<TodoList todos={mockTodos} onMarkAsDone={mockOnMarkAsDone} />);

      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 3')).toBeInTheDocument();
    });

    test('should render todo descriptions', () => {
      render(<TodoList todos={mockTodos} onMarkAsDone={mockOnMarkAsDone} />);

      expect(screen.getByText('This is a test todo description')).toBeInTheDocument();
      expect(screen.getByText('Another test todo description')).toBeInTheDocument();
      expect(screen.getByText('Third test todo description')).toBeInTheDocument();
    });

    test('should render priority badges correctly', () => {
      render(<TodoList todos={mockTodos} onMarkAsDone={mockOnMarkAsDone} />);

      expect(screen.getByText('🔴 High')).toBeInTheDocument();
      expect(screen.getByText('🟡 Medium')).toBeInTheDocument();
      expect(screen.getByText('🟢 Low')).toBeInTheDocument();
    });

    test('should render category badges correctly', () => {
      render(<TodoList todos={mockTodos} onMarkAsDone={mockOnMarkAsDone} />);

      expect(screen.getByText('💼 Work')).toBeInTheDocument();
      expect(screen.getByText('🏠 Personal')).toBeInTheDocument();
      expect(screen.getByText('🛒 Shopping')).toBeInTheDocument();
    });

    test('should render numbered badges for todos', () => {
      render(<TodoList todos={mockTodos} onMarkAsDone={mockOnMarkAsDone} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    test('should render Done buttons for each todo', () => {
      render(<TodoList todos={mockTodos} onMarkAsDone={mockOnMarkAsDone} />);

      const doneButtons = screen.getAllByRole('button', { name: /done/i });
      expect(doneButtons).toHaveLength(3);
    });
  });

  describe('Rendering Empty State', () => {
    test('should render empty state when no todos provided', () => {
      render(<TodoList todos={[]} onMarkAsDone={mockOnMarkAsDone} />);

      expect(screen.getByText('No todos yet')).toBeInTheDocument();
      expect(screen.getByText('Your productivity journey starts here! Create your first todo and watch the magic happen.')).toBeInTheDocument();
    });

    test('should render empty state emoji and animation', () => {
      render(<TodoList todos={[]} onMarkAsDone={mockOnMarkAsDone} />);

      expect(screen.getByText('📝')).toBeInTheDocument();
      expect(screen.getByText('✨')).toBeInTheDocument();
    });

    test('should not render Done buttons when no todos', () => {
      render(<TodoList todos={[]} onMarkAsDone={mockOnMarkAsDone} />);

      const doneButtons = screen.queryAllByRole('button', { name: /done/i });
      expect(doneButtons).toHaveLength(0);
    });
  });

  describe('User Interactions', () => {
    test('should call onMarkAsDone when Done button is clicked', async () => {
      render(<TodoList todos={mockTodos} onMarkAsDone={mockOnMarkAsDone} />);

      const doneButtons = screen.getAllByRole('button', { name: /done/i });
      await user.click(doneButtons[0]);

      expect(mockOnMarkAsDone).toHaveBeenCalledWith(1);
    });

    test('should call onMarkAsDone with correct todo ID for each button', async () => {
      render(<TodoList todos={mockTodos} onMarkAsDone={mockOnMarkAsDone} />);

      const doneButtons = screen.getAllByRole('button', { name: /done/i });
      
      await user.click(doneButtons[0]);
      expect(mockOnMarkAsDone).toHaveBeenCalledWith(1);

      await user.click(doneButtons[1]);
      expect(mockOnMarkAsDone).toHaveBeenCalledWith(2);

      await user.click(doneButtons[2]);
      expect(mockOnMarkAsDone).toHaveBeenCalledWith(3);
    });

    test('should handle multiple clicks on Done buttons', async () => {
      render(<TodoList todos={mockTodos} onMarkAsDone={mockOnMarkAsDone} />);

      const doneButtons = screen.getAllByRole('button', { name: /done/i });
      
      await user.click(doneButtons[0]);
      await user.click(doneButtons[1]);

      expect(mockOnMarkAsDone).toHaveBeenCalledTimes(2);
      expect(mockOnMarkAsDone).toHaveBeenNthCalledWith(1, 1);
      expect(mockOnMarkAsDone).toHaveBeenNthCalledWith(2, 2);
    });
  });

  describe('Priority Badge Styling', () => {
    test('should apply correct CSS classes for high priority', () => {
      const highPriorityTodos = mockTodos.filter(todo => todo.priority === 'high');
      render(<TodoList todos={highPriorityTodos} onMarkAsDone={mockOnMarkAsDone} />);

      const highPriorityBadge = screen.getByText('🔴 High');
      expect(highPriorityBadge).toHaveClass('bg-red-100', 'text-red-700');
    });

    test('should apply correct CSS classes for medium priority', () => {
      const mediumPriorityTodos = mockTodos.filter(todo => todo.priority === 'medium');
      render(<TodoList todos={mediumPriorityTodos} onMarkAsDone={mockOnMarkAsDone} />);

      const mediumPriorityBadge = screen.getByText('🟡 Medium');
      expect(mediumPriorityBadge).toHaveClass('bg-yellow-100', 'text-yellow-700');
    });

    test('should apply correct CSS classes for low priority', () => {
      const lowPriorityTodos = mockTodos.filter(todo => todo.priority === 'low');
      render(<TodoList todos={lowPriorityTodos} onMarkAsDone={mockOnMarkAsDone} />);

      const lowPriorityBadge = screen.getByText('🟢 Low');
      expect(lowPriorityBadge).toHaveClass('bg-green-100', 'text-green-700');
    });

    test('should default to medium priority when priority is undefined', () => {
      const todosWithUndefinedPriority = [{
        ...mockTodos[0],
        priority: undefined
      }];
      render(<TodoList todos={todosWithUndefinedPriority} onMarkAsDone={mockOnMarkAsDone} />);

      const priorityBadge = screen.getByText('🟡 Medium');
      expect(priorityBadge).toHaveClass('bg-yellow-100', 'text-yellow-700');
    });
  });

  describe('Category Badge Styling', () => {
    test('should render correct emoji and text for work category', () => {
      const workTodos = mockTodos.filter(todo => todo.category === 'work');
      render(<TodoList todos={workTodos} onMarkAsDone={mockOnMarkAsDone} />);

      expect(screen.getByText('💼 Work')).toBeInTheDocument();
    });

    test('should render correct emoji and text for personal category', () => {
      const personalTodos = mockTodos.filter(todo => todo.category === 'personal');
      render(<TodoList todos={personalTodos} onMarkAsDone={mockOnMarkAsDone} />);

      expect(screen.getByText('🏠 Personal')).toBeInTheDocument();
    });

    test('should render correct emoji and text for shopping category', () => {
      const shoppingTodos = mockTodos.filter(todo => todo.category === 'shopping');
      render(<TodoList todos={shoppingTodos} onMarkAsDone={mockOnMarkAsDone} />);

      expect(screen.getByText('🛒 Shopping')).toBeInTheDocument();
    });

    test('should default to general category when category is undefined', () => {
      const todosWithUndefinedCategory = [{
        ...mockTodos[0],
        category: undefined
      }];
      render(<TodoList todos={todosWithUndefinedCategory} onMarkAsDone={mockOnMarkAsDone} />);

      expect(screen.getByText('📝 General')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('should render todos in correct order', () => {
      render(<TodoList todos={mockTodos} onMarkAsDone={mockOnMarkAsDone} />);

      const todoElements = screen.getAllByText(/Test Todo \d/);
      expect(todoElements[0]).toHaveTextContent('Test Todo 1');
      expect(todoElements[1]).toHaveTextContent('Test Todo 2');
      expect(todoElements[2]).toHaveTextContent('Test Todo 3');
    });

    test('should have proper key attributes for todos', () => {
      const { container } = render(<TodoList todos={mockTodos} onMarkAsDone={mockOnMarkAsDone} />);
      
      // Check if todos are rendered with proper structure
      const todoContainers = container.querySelectorAll('[class*="group bg-gradient-to-r"]');
      expect(todoContainers).toHaveLength(3);
    });

    test('should render with proper CSS classes', () => {
      render(<TodoList todos={mockTodos} onMarkAsDone={mockOnMarkAsDone} />);

      const todoContainers = screen.getAllByText(/Test Todo \d/);
      todoContainers.forEach(container => {
        const parentElement = container.closest('[class*="group bg-gradient-to-r"]');
        expect(parentElement).toHaveClass('group', 'bg-gradient-to-r', 'from-white', 'to-gray-50');
      });
    });
  });

  describe('Animation and Styling', () => {
    test('should have animation delay styles', () => {
      const { container } = render(<TodoList todos={mockTodos} onMarkAsDone={mockOnMarkAsDone} />);
      
      const todoContainers = container.querySelectorAll('[class*="group bg-gradient-to-r"]');
      expect(todoContainers[0]).toHaveStyle('animation-delay: 0ms');
      expect(todoContainers[1]).toHaveStyle('animation-delay: 100ms');
      expect(todoContainers[2]).toHaveStyle('animation-delay: 200ms');
    });

    test('should have hover effects', () => {
      render(<TodoList todos={mockTodos} onMarkAsDone={mockOnMarkAsDone} />);

      const todoContainers = screen.getAllByText(/Test Todo \d/);
      todoContainers.forEach(container => {
        const parentElement = container.closest('[class*="group bg-gradient-to-r"]');
        expect(parentElement).toHaveClass('hover:shadow-xl', 'hover:shadow-blue-100/50', 'hover:-translate-y-1');
      });
    });

    test('should have transition classes', () => {
      render(<TodoList todos={mockTodos} onMarkAsDone={mockOnMarkAsDone} />);

      const todoContainers = screen.getAllByText(/Test Todo \d/);
      todoContainers.forEach(container => {
        const parentElement = container.closest('[class*="group bg-gradient-to-r"]');
        expect(parentElement).toHaveClass('transition-all', 'duration-300', 'transform');
      });
    });
  });

  describe('Button Styling and Behavior', () => {
    test('should render Done buttons with correct styling', () => {
      render(<TodoList todos={mockTodos} onMarkAsDone={mockOnMarkAsDone} />);

      const doneButtons = screen.getAllByRole('button', { name: /done/i });
      doneButtons.forEach(button => {
        expect(button).toHaveClass('group/btn', 'bg-gradient-to-r', 'from-green-400', 'to-emerald-500');
      });
    });

    test('should have hover effects on Done buttons', () => {
      render(<TodoList todos={mockTodos} onMarkAsDone={mockOnMarkAsDone} />);

      const doneButtons = screen.getAllByRole('button', { name: /done/i });
      doneButtons.forEach(button => {
        expect(button).toHaveClass('hover:from-green-500', 'hover:to-emerald-600', 'hover:-translate-y-1');
      });
    });

    test('should have proper button content', () => {
      render(<TodoList todos={mockTodos} onMarkAsDone={mockOnMarkAsDone} />);

      const doneButtons = screen.getAllByRole('button', { name: /done/i });
      doneButtons.forEach(button => {
        expect(button).toHaveTextContent('✅');
        expect(button).toHaveTextContent('Done');
        expect(button).toHaveTextContent('→');
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle todos with missing properties gracefully', () => {
      const incompleteTodos = [{
        todo_id: 1,
        title: 'Incomplete Todo',
        description: 'Missing priority and category'
      }];
      
      render(<TodoList todos={incompleteTodos} onMarkAsDone={mockOnMarkAsDone} />);

      expect(screen.getByText('Incomplete Todo')).toBeInTheDocument();
      expect(screen.getByText('Missing priority and category')).toBeInTheDocument();
      expect(screen.getByText('🟡 Medium')).toBeInTheDocument(); // Default priority
      expect(screen.getByText('📝 General')).toBeInTheDocument(); // Default category
    });

    test('should handle very long todo titles', () => {
      const longTitleTodos = [{
        todo_id: 1,
        title: 'This is a very long todo title that should be handled gracefully by the component',
        description: 'Short description',
        priority: 'high',
        category: 'work'
      }];
      
      render(<TodoList todos={longTitleTodos} onMarkAsDone={mockOnMarkAsDone} />);

      expect(screen.getByText('This is a very long todo title that should be handled gracefully by the component')).toBeInTheDocument();
    });

    test('should handle very long todo descriptions', () => {
      const longDescriptionTodos = [{
        todo_id: 1,
        title: 'Short Title',
        description: 'This is a very long description that contains multiple sentences and should be handled gracefully by the component without breaking the layout or causing any visual issues.',
        priority: 'medium',
        category: 'personal'
      }];
      
      render(<TodoList todos={longDescriptionTodos} onMarkAsDone={mockOnMarkAsDone} />);

      expect(screen.getByText('This is a very long description that contains multiple sentences and should be handled gracefully by the component without breaking the layout or causing any visual issues.')).toBeInTheDocument();
    });
  });
});
