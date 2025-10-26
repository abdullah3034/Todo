const { createMockRequest, createMockResponse, createMockPool } = require('../testHelpers');

// Mock the database module
jest.mock('../../db', () => ({
  query: jest.fn()
}));

describe('Route Handlers Unit Tests', () => {
  let mockPool;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockPool = createMockPool();
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    
    // Mock the db module
    const db = require('../../db');
    db.query = mockPool.query;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /todos - Create Todo', () => {
    test('should create todo with all fields', async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'Test Description',
        priority: 'high',
        category: 'testing'
      };

      const mockCreatedTodo = {
        todo_id: 1,
        ...todoData,
        completed: false,
        created_at: new Date()
      };

      mockReq.body = todoData;
      mockPool.query.mockResolvedValue({ rows: [mockCreatedTodo] });

      // Import the app and get the route handler
      const app = require('../../index');
      const route = app._router.stack.find(layer => layer.route?.path === '/todos' && layer.route?.methods?.post);
      
      // Simulate the route handler
      const handler = route.route.stack[0].handle;
      await handler(mockReq, mockRes);

      expect(mockPool.query).toHaveBeenCalledWith(
        'INSERT INTO todos (title, description, priority, category) VALUES ($1, $2, $3, $4) RETURNING *',
        [todoData.title, todoData.description, todoData.priority, todoData.category]
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockCreatedTodo);
    });

    test('should create todo with default values', async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'Test Description'
      };

      const mockCreatedTodo = {
        todo_id: 1,
        title: 'Test Todo',
        description: 'Test Description',
        priority: 'medium',
        category: 'general',
        completed: false,
        created_at: new Date()
      };

      mockReq.body = todoData;
      mockPool.query.mockResolvedValue({ rows: [mockCreatedTodo] });

      const app = require('../../index');
      const route = app._router.stack.find(layer => layer.route?.path === '/todos' && layer.route?.methods?.post);
      const handler = route.route.stack[0].handle;
      await handler(mockReq, mockRes);

      expect(mockPool.query).toHaveBeenCalledWith(
        'INSERT INTO todos (title, description, priority, category) VALUES ($1, $2, $3, $4) RETURNING *',
        ['Test Todo', 'Test Description', 'medium', 'general']
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockCreatedTodo);
    });

    test('should handle database errors', async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'Test Description'
      };

      mockReq.body = todoData;
      mockPool.query.mockRejectedValue(new Error('Database error'));

      const app = require('../../index');
      const route = app._router.stack.find(layer => layer.route?.path === '/todos' && layer.route?.methods?.post);
      const handler = route.route.stack[0].handle;
      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith('Server Error');
    });
  });

  describe('GET /todos - Get All Todos', () => {
    test('should return all todos', async () => {
      const mockTodos = [
        { todo_id: 1, title: 'Todo 1', description: 'Description 1' },
        { todo_id: 2, title: 'Todo 2', description: 'Description 2' }
      ];

      mockPool.query.mockResolvedValue({ rows: mockTodos });

      const app = require('../../index');
      const route = app._router.stack.find(layer => layer.route?.path === '/todos' && layer.route?.methods?.get);
      const handler = route.route.stack[0].handle;
      await handler(mockReq, mockRes);

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM todos');
      expect(mockRes.json).toHaveBeenCalledWith(mockTodos);
    });

    test('should handle empty result', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const app = require('../../index');
      const route = app._router.stack.find(layer => layer.route?.path === '/todos' && layer.route?.methods?.get);
      const handler = route.route.stack[0].handle;
      await handler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith([]);
    });

    test('should handle database errors', async () => {
      mockPool.query.mockRejectedValue(new Error('Database error'));

      const app = require('../../index');
      const route = app._router.stack.find(layer => layer.route?.path === '/todos' && layer.route?.methods?.get);
      const handler = route.route.stack[0].handle;
      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith('Server Error');
    });
  });

  describe('GET /todos/:id - Get Single Todo', () => {
    test('should return single todo', async () => {
      const mockTodo = {
        todo_id: 1,
        title: 'Test Todo',
        description: 'Test Description'
      };

      mockReq.params = { id: '1' };
      mockPool.query.mockResolvedValue({ rows: [mockTodo] });

      const app = require('../../index');
      const route = app._router.stack.find(layer => layer.route?.path === '/todos/:id' && layer.route?.methods?.get);
      const handler = route.route.stack[0].handle;
      await handler(mockReq, mockRes);

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM todos WHERE todo_id = $1', ['1']);
      expect(mockRes.json).toHaveBeenCalledWith(mockTodo);
    });

    test('should handle todo not found', async () => {
      mockReq.params = { id: '999' };
      mockPool.query.mockResolvedValue({ rows: [] });

      const app = require('../../index');
      const route = app._router.stack.find(layer => layer.route?.path === '/todos/:id' && layer.route?.methods?.get);
      const handler = route.route.stack[0].handle;
      await handler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(undefined);
    });
  });

  describe('PUT /todos/:id - Update Todo', () => {
    test('should update todo successfully', async () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description',
        priority: 'low',
        category: 'updated',
        completed: true
      };

      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockPool.query.mockResolvedValue({ rowCount: 1 });

      const app = require('../../index');
      const route = app._router.stack.find(layer => layer.route?.path === '/todos/:id' && layer.route?.methods?.put);
      const handler = route.route.stack[0].handle;
      await handler(mockReq, mockRes);

      expect(mockPool.query).toHaveBeenCalledWith(
        'UPDATE todos SET title = $1, description = $2, priority = $3, category = $4, completed = $5 WHERE todo_id = $6',
        [updateData.title, updateData.description, updateData.priority, updateData.category, updateData.completed, '1']
      );
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Todo updated successfully' });
    });
  });

  describe('DELETE /todos/:id - Delete Todo', () => {
    test('should delete todo successfully', async () => {
      mockReq.params = { id: '1' };
      mockPool.query.mockResolvedValue({ rowCount: 1 });

      const app = require('../../index');
      const route = app._router.stack.find(layer => layer.route?.path === '/todos/:id' && layer.route?.methods?.delete);
      const handler = route.route.stack[0].handle;
      await handler(mockReq, mockRes);

      expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM todos WHERE todo_id = $1', ['1']);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Todo deleted successfully' });
    });
  });
});
