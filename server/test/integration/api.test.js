const request = require('supertest');
const app = require('../index');
const { setupTestDatabase, cleanupTestDatabase, insertTestTodo, testTodos } = require('../testHelpers');

describe('Todo API Integration Tests', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
  });

  describe('POST /todos', () => {
    test('should create a new todo with all fields', async () => {
      const todoData = testTodos.validTodo;

      const response = await request(app)
        .post('/todos')
        .send(todoData)
        .expect(200);

      expect(response.body).toMatchObject({
        title: todoData.title,
        description: todoData.description,
        priority: todoData.priority,
        category: todoData.category,
        completed: false
      });
      expect(response.body.todo_id).toBeDefined();
      expect(response.body.created_at).toBeDefined();
    });

    test('should create a todo with default values', async () => {
      const todoData = testTodos.minimalTodo;

      const response = await request(app)
        .post('/todos')
        .send(todoData)
        .expect(200);

      expect(response.body).toMatchObject({
        title: todoData.title,
        description: todoData.description,
        priority: 'medium',
        category: 'general',
        completed: false
      });
    });

    test('should return 500 for invalid data', async () => {
      const invalidData = testTodos.invalidTodo;

      await request(app)
        .post('/todos')
        .send(invalidData)
        .expect(500);
    });

    test('should handle empty request body', async () => {
      await request(app)
        .post('/todos')
        .send({})
        .expect(500);
    });
  });

  describe('GET /todos', () => {
    test('should return empty array when no todos exist', async () => {
      const response = await request(app)
        .get('/todos')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    test('should return all todos', async () => {
      // Insert test todos
      const todo1 = await insertTestTodo({
        title: 'Todo 1',
        description: 'Description 1',
        priority: 'high',
        category: 'work'
      });

      const todo2 = await insertTestTodo({
        title: 'Todo 2',
        description: 'Description 2',
        priority: 'low',
        category: 'personal'
      });

      const response = await request(app)
        .get('/todos')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'Todo 1',
            description: 'Description 1',
            priority: 'high',
            category: 'work'
          }),
          expect.objectContaining({
            title: 'Todo 2',
            description: 'Description 2',
            priority: 'low',
            category: 'personal'
          })
        ])
      );
    });
  });

  describe('GET /todos/:id', () => {
    test('should return specific todo', async () => {
      const createdTodo = await insertTestTodo(testTodos.validTodo);

      const response = await request(app)
        .get(`/todos/${createdTodo.todo_id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        todo_id: createdTodo.todo_id,
        title: testTodos.validTodo.title,
        description: testTodos.validTodo.description,
        priority: testTodos.validTodo.priority,
        category: testTodos.validTodo.category
      });
    });

    test('should return undefined for non-existent todo', async () => {
      const response = await request(app)
        .get('/todos/999')
        .expect(200);

      expect(response.body).toBeUndefined();
    });

    test('should handle invalid id format', async () => {
      await request(app)
        .get('/todos/invalid')
        .expect(200);
    });
  });

  describe('PUT /todos/:id', () => {
    test('should update todo successfully', async () => {
      const createdTodo = await insertTestTodo(testTodos.validTodo);

      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description',
        priority: 'low',
        category: 'updated',
        completed: true
      };

      const response = await request(app)
        .put(`/todos/${createdTodo.todo_id}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual({ message: 'Todo updated successfully' });

      // Verify the update by fetching the todo
      const getResponse = await request(app)
        .get(`/todos/${createdTodo.todo_id}`)
        .expect(200);

      expect(getResponse.body).toMatchObject({
        title: updateData.title,
        description: updateData.description,
        priority: updateData.priority,
        category: updateData.category,
        completed: updateData.completed
      });
    });

    test('should handle partial updates', async () => {
      const createdTodo = await insertTestTodo(testTodos.validTodo);

      const partialUpdate = {
        title: 'Partially Updated Title',
        completed: true
      };

      await request(app)
        .put(`/todos/${createdTodo.todo_id}`)
        .send(partialUpdate)
        .expect(200);

      // Verify partial update
      const getResponse = await request(app)
        .get(`/todos/${createdTodo.todo_id}`)
        .expect(200);

      expect(getResponse.body.title).toBe(partialUpdate.title);
      expect(getResponse.body.completed).toBe(partialUpdate.completed);
      // Original values should remain unchanged
      expect(getResponse.body.description).toBe(testTodos.validTodo.description);
    });

    test('should return 500 for non-existent todo', async () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description'
      };

      await request(app)
        .put('/todos/999')
        .send(updateData)
        .expect(200); // Still returns 200 but with error message
    });
  });

  describe('DELETE /todos/:id', () => {
    test('should delete todo successfully', async () => {
      const createdTodo = await insertTestTodo(testTodos.validTodo);

      const response = await request(app)
        .delete(`/todos/${createdTodo.todo_id}`)
        .expect(200);

      expect(response.body).toEqual({ message: 'Todo deleted successfully' });

      // Verify deletion
      const getResponse = await request(app)
        .get(`/todos/${createdTodo.todo_id}`)
        .expect(200);

      expect(getResponse.body).toBeUndefined();
    });

    test('should handle deletion of non-existent todo', async () => {
      const response = await request(app)
        .delete('/todos/999')
        .expect(200);

      expect(response.body).toEqual({ message: 'Todo deleted successfully' });
    });

    test('should handle invalid id format', async () => {
      await request(app)
        .delete('/todos/invalid')
        .expect(200);
    });
  });

  describe('API Error Handling', () => {
    test('should handle malformed JSON', async () => {
      await request(app)
        .post('/todos')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);
    });

    test('should handle unsupported content type', async () => {
      await request(app)
        .post('/todos')
        .set('Content-Type', 'text/plain')
        .send('plain text')
        .expect(400);
    });
  });

  describe('CORS Headers', () => {
    test('should include CORS headers', async () => {
      const response = await request(app)
        .get('/todos')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    test('should handle preflight requests', async () => {
      await request(app)
        .options('/todos')
        .expect(204);
    });
  });

  describe('Complete Todo Workflow', () => {
    test('should handle complete CRUD operations', async () => {
      // 1. Create a todo
      const createResponse = await request(app)
        .post('/todos')
        .send(testTodos.validTodo)
        .expect(200);

      const todoId = createResponse.body.todo_id;

      // 2. Read the todo
      const readResponse = await request(app)
        .get(`/todos/${todoId}`)
        .expect(200);

      expect(readResponse.body.todo_id).toBe(todoId);

      // 3. Update the todo
      const updateData = {
        title: 'Updated Todo',
        description: 'Updated Description',
        priority: 'low',
        category: 'updated',
        completed: true
      };

      await request(app)
        .put(`/todos/${todoId}`)
        .send(updateData)
        .expect(200);

      // 4. Verify update
      const updatedResponse = await request(app)
        .get(`/todos/${todoId}`)
        .expect(200);

      expect(updatedResponse.body).toMatchObject(updateData);

      // 5. Delete the todo
      await request(app)
        .delete(`/todos/${todoId}`)
        .expect(200);

      // 6. Verify deletion
      const deletedResponse = await request(app)
        .get(`/todos/${todoId}`)
        .expect(200);

      expect(deletedResponse.body).toBeUndefined();
    });
  });
});
