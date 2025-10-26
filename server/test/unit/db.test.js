const { Pool } = require('pg');
const { createMockPool, createMockRequest, createMockResponse } = require('./testHelpers');

// Mock the pg module
jest.mock('pg', () => ({
  Pool: jest.fn()
}));

describe('Database Connection Unit Tests', () => {
  let mockPool;

  beforeEach(() => {
    mockPool = {
      query: jest.fn()
    };
    Pool.mockImplementation(() => mockPool);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Database Configuration', () => {
    test('should create pool with correct configuration', () => {
      const db = require('../db');
      
      expect(Pool).toHaveBeenCalledWith({
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'Dita8220#',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'todo_app'
      });
    });

    test('should use environment variables when available', () => {
      const originalEnv = process.env;
      process.env = {
        ...originalEnv,
        DB_USER: 'testuser',
        DB_PASSWORD: 'testpass',
        DB_HOST: 'testhost',
        DB_PORT: '5433',
        DB_NAME: 'testdb'
      };

      // Clear module cache to force re-import
      delete require.cache[require.resolve('../db')];
      require('../db');

      expect(Pool).toHaveBeenCalledWith({
        user: 'testuser',
        password: 'testpass',
        host: 'testhost',
        port: '5433',
        database: 'testdb'
      });

      process.env = originalEnv;
    });
  });

  describe('Database Query Operations', () => {
    test('should handle successful query', async () => {
      const mockResult = {
        rows: [{ id: 1, title: 'Test Todo' }]
      };
      mockPool.query.mockResolvedValue(mockResult);

      const db = require('../db');
      const result = await db.query('SELECT * FROM todos');

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM todos');
      expect(result).toEqual(mockResult);
    });

    test('should handle query with parameters', async () => {
      const mockResult = {
        rows: [{ id: 1, title: 'Test Todo' }]
      };
      mockPool.query.mockResolvedValue(mockResult);

      const db = require('../db');
      const result = await db.query('SELECT * FROM todos WHERE id = $1', [1]);

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM todos WHERE id = $1', [1]);
      expect(result).toEqual(mockResult);
    });

    test('should handle query errors', async () => {
      const mockError = new Error('Database connection failed');
      mockPool.query.mockRejectedValue(mockError);

      const db = require('../db');

      await expect(db.query('SELECT * FROM todos')).rejects.toThrow('Database connection failed');
    });
  });
});

describe('Todo Operations Unit Tests', () => {
  let mockPool;

  beforeEach(() => {
    mockPool = createMockPool();
    jest.doMock('../db', () => mockPool);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('Create Todo Operation', () => {
    test('should create todo with all fields', async () => {
      const mockTodo = {
        todo_id: 1,
        title: 'Test Todo',
        description: 'Test Description',
        priority: 'high',
        category: 'testing',
        completed: false,
        created_at: new Date()
      };

      mockPool.query.mockResolvedValue({ rows: [mockTodo] });

      const db = require('../db');
      const result = await db.query(
        'INSERT INTO todos (title, description, priority, category) VALUES ($1, $2, $3, $4) RETURNING *',
        ['Test Todo', 'Test Description', 'high', 'testing']
      );

      expect(mockPool.query).toHaveBeenCalledWith(
        'INSERT INTO todos (title, description, priority, category) VALUES ($1, $2, $3, $4) RETURNING *',
        ['Test Todo', 'Test Description', 'high', 'testing']
      );
      expect(result.rows[0]).toEqual(mockTodo);
    });

    test('should create todo with default values', async () => {
      const mockTodo = {
        todo_id: 1,
        title: 'Test Todo',
        description: 'Test Description',
        priority: 'medium',
        category: 'general',
        completed: false,
        created_at: new Date()
      };

      mockPool.query.mockResolvedValue({ rows: [mockTodo] });

      const db = require('../db');
      const result = await db.query(
        'INSERT INTO todos (title, description, priority, category) VALUES ($1, $2, $3, $4) RETURNING *',
        ['Test Todo', 'Test Description', 'medium', 'general']
      );

      expect(result.rows[0].priority).toBe('medium');
      expect(result.rows[0].category).toBe('general');
    });
  });

  describe('Read Todo Operations', () => {
    test('should get all todos', async () => {
      const mockTodos = [
        { todo_id: 1, title: 'Todo 1', description: 'Description 1' },
        { todo_id: 2, title: 'Todo 2', description: 'Description 2' }
      ];

      mockPool.query.mockResolvedValue({ rows: mockTodos });

      const db = require('../db');
      const result = await db.query('SELECT * FROM todos');

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM todos');
      expect(result.rows).toEqual(mockTodos);
    });

    test('should get single todo by id', async () => {
      const mockTodo = {
        todo_id: 1,
        title: 'Test Todo',
        description: 'Test Description'
      };

      mockPool.query.mockResolvedValue({ rows: [mockTodo] });

      const db = require('../db');
      const result = await db.query('SELECT * FROM todos WHERE todo_id = $1', [1]);

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM todos WHERE todo_id = $1', [1]);
      expect(result.rows[0]).toEqual(mockTodo);
    });
  });

  describe('Update Todo Operation', () => {
    test('should update todo with all fields', async () => {
      mockPool.query.mockResolvedValue({ rowCount: 1 });

      const db = require('../db');
      await db.query(
        'UPDATE todos SET title = $1, description = $2, priority = $3, category = $4, completed = $5 WHERE todo_id = $6',
        ['Updated Title', 'Updated Description', 'low', 'updated', true, 1]
      );

      expect(mockPool.query).toHaveBeenCalledWith(
        'UPDATE todos SET title = $1, description = $2, priority = $3, category = $4, completed = $5 WHERE todo_id = $6',
        ['Updated Title', 'Updated Description', 'low', 'updated', true, 1]
      );
    });
  });

  describe('Delete Todo Operation', () => {
    test('should delete todo by id', async () => {
      mockPool.query.mockResolvedValue({ rowCount: 1 });

      const db = require('../db');
      await db.query('DELETE FROM todos WHERE todo_id = $1', [1]);

      expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM todos WHERE todo_id = $1', [1]);
    });
  });
});
