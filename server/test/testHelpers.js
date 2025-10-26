const testDb = require('./testDb');

// Test data helpers
const testTodos = {
  validTodo: {
    title: 'Test Todo',
    description: 'This is a test todo',
    priority: 'high',
    category: 'testing'
  },
  minimalTodo: {
    title: 'Minimal Todo',
    description: 'Minimal test todo'
  },
  invalidTodo: {
    description: 'Missing title'
  }
};

// Database setup and teardown helpers
const setupTestDatabase = async () => {
  try {
    // Create test database if it doesn't exist
    await testDb.query(`
      CREATE TABLE IF NOT EXISTS todos (
        todo_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        priority VARCHAR(20) DEFAULT 'medium',
        category VARCHAR(50) DEFAULT 'general',
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
};

const cleanupTestDatabase = async () => {
  try {
    await testDb.query('DELETE FROM todos');
  } catch (error) {
    console.error('Error cleaning up test database:', error);
    throw error;
  }
};

const insertTestTodo = async (todoData = testTodos.validTodo) => {
  const result = await testDb.query(
    'INSERT INTO todos (title, description, priority, category) VALUES ($1, $2, $3, $4) RETURNING *',
    [todoData.title, todoData.description, todoData.priority || 'medium', todoData.category || 'general']
  );
  return result.rows[0];
};

const getTestTodo = async (id) => {
  const result = await testDb.query('SELECT * FROM todos WHERE todo_id = $1', [id]);
  return result.rows[0];
};

const getAllTestTodos = async () => {
  const result = await testDb.query('SELECT * FROM todos');
  return result.rows;
};

// Mock helpers for unit tests
const createMockRequest = (params = {}, body = {}, query = {}) => ({
  params,
  body,
  query
});

const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const createMockPool = (mockQuery) => ({
  query: jest.fn().mockImplementation(mockQuery)
});

module.exports = {
  testTodos,
  setupTestDatabase,
  cleanupTestDatabase,
  insertTestTodo,
  getTestTodo,
  getAllTestTodos,
  createMockRequest,
  createMockResponse,
  createMockPool,
  testDb
};
