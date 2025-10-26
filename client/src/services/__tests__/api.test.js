import axios from 'axios';
import { todoAPI } from '../services/api';
import { mockTodos, mockTodoFormData, mockApiResponses } from '../testUtils';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('API Configuration', () => {
    test('should create axios instance with correct base URL', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:5000',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    test('should use environment variable for API URL when available', () => {
      const originalEnv = process.env.REACT_APP_API_URL;
      process.env.REACT_APP_API_URL = 'http://test-api.com';
      
      // Clear module cache to force re-import
      delete require.cache[require.resolve('../services/api')];
      require('../services/api');
      
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://test-api.com',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Restore original environment
      process.env.REACT_APP_API_URL = originalEnv;
    });
  });

  describe('getAllTodos', () => {
    test('should fetch all todos successfully', async () => {
      const mockResponse = { data: mockTodos };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await todoAPI.getAllTodos();

      expect(mockedAxios.get).toHaveBeenCalledWith('/todos');
      expect(result).toEqual(mockTodos);
    });

    test('should handle API errors', async () => {
      const mockError = new Error('Network Error');
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(todoAPI.getAllTodos()).rejects.toThrow('Network Error');
      expect(mockedAxios.get).toHaveBeenCalledWith('/todos');
    });

    test('should handle empty response', async () => {
      const mockResponse = { data: [] };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await todoAPI.getAllTodos();

      expect(result).toEqual([]);
      expect(mockedAxios.get).toHaveBeenCalledWith('/todos');
    });

    test('should handle malformed response', async () => {
      const mockResponse = { data: null };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await todoAPI.getAllTodos();

      expect(result).toBeNull();
    });
  });

  describe('createTodo', () => {
    test('should create todo successfully', async () => {
      const mockResponse = { 
        data: { 
          todo_id: 4, 
          ...mockTodoFormData, 
          completed: false, 
          created_at: new Date().toISOString() 
        } 
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await todoAPI.createTodo(mockTodoFormData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/todos', mockTodoFormData);
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle creation errors', async () => {
      const mockError = new Error('Validation Error');
      mockedAxios.post.mockRejectedValue(mockError);

      await expect(todoAPI.createTodo(mockTodoFormData)).rejects.toThrow('Validation Error');
      expect(mockedAxios.post).toHaveBeenCalledWith('/todos', mockTodoFormData);
    });

    test('should handle server validation errors', async () => {
      const mockError = {
        response: {
          status: 400,
          data: { message: 'Title is required' }
        }
      };
      mockedAxios.post.mockRejectedValue(mockError);

      await expect(todoAPI.createTodo({})).rejects.toEqual(mockError);
    });

    test('should create todo with minimal data', async () => {
      const minimalData = { title: 'Test', description: 'Test Description' };
      const mockResponse = { 
        data: { 
          todo_id: 5, 
          ...minimalData,
          priority: 'medium',
          category: 'general',
          completed: false, 
          created_at: new Date().toISOString() 
        } 
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await todoAPI.createTodo(minimalData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/todos', minimalData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateTodo', () => {
    test('should update todo successfully', async () => {
      const todoId = 1;
      const updateData = { title: 'Updated Title', completed: true };
      const mockResponse = { data: { message: 'Todo updated successfully' } };
      mockedAxios.put.mockResolvedValue(mockResponse);

      const result = await todoAPI.updateTodo(todoId, updateData);

      expect(mockedAxios.put).toHaveBeenCalledWith(`/todos/${todoId}`, updateData);
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle update errors', async () => {
      const todoId = 1;
      const updateData = { title: 'Updated Title' };
      const mockError = new Error('Update Failed');
      mockedAxios.put.mockRejectedValue(mockError);

      await expect(todoAPI.updateTodo(todoId, updateData)).rejects.toThrow('Update Failed');
      expect(mockedAxios.put).toHaveBeenCalledWith(`/todos/${todoId}`, updateData);
    });

    test('should handle non-existent todo update', async () => {
      const todoId = 999;
      const updateData = { title: 'Updated Title' };
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Todo not found' }
        }
      };
      mockedAxios.put.mockRejectedValue(mockError);

      await expect(todoAPI.updateTodo(todoId, updateData)).rejects.toEqual(mockError);
    });

    test('should update todo with partial data', async () => {
      const todoId = 1;
      const partialData = { completed: true };
      const mockResponse = { data: { message: 'Todo updated successfully' } };
      mockedAxios.put.mockResolvedValue(mockResponse);

      const result = await todoAPI.updateTodo(todoId, partialData);

      expect(mockedAxios.put).toHaveBeenCalledWith(`/todos/${todoId}`, partialData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteTodo', () => {
    test('should delete todo successfully', async () => {
      const todoId = 1;
      const mockResponse = { data: { message: 'Todo deleted successfully' } };
      mockedAxios.delete.mockResolvedValue(mockResponse);

      const result = await todoAPI.deleteTodo(todoId);

      expect(mockedAxios.delete).toHaveBeenCalledWith(`/todos/${todoId}`);
      expect(result).toEqual(mockResponse.data);
    });

    test('should handle deletion errors', async () => {
      const todoId = 1;
      const mockError = new Error('Delete Failed');
      mockedAxios.delete.mockRejectedValue(mockError);

      await expect(todoAPI.deleteTodo(todoId)).rejects.toThrow('Delete Failed');
      expect(mockedAxios.delete).toHaveBeenCalledWith(`/todos/${todoId}`);
    });

    test('should handle non-existent todo deletion', async () => {
      const todoId = 999;
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Todo not found' }
        }
      };
      mockedAxios.delete.mockRejectedValue(mockError);

      await expect(todoAPI.deleteTodo(todoId)).rejects.toEqual(mockError);
    });

    test('should handle network errors during deletion', async () => {
      const todoId = 1;
      const mockError = {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed'
      };
      mockedAxios.delete.mockRejectedValue(mockError);

      await expect(todoAPI.deleteTodo(todoId)).rejects.toEqual(mockError);
    });
  });

  describe('Error Handling', () => {
    test('should handle timeout errors', async () => {
      const mockError = {
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded'
      };
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(todoAPI.getAllTodos()).rejects.toEqual(mockError);
    });

    test('should handle server errors (500)', async () => {
      const mockError = {
        response: {
          status: 500,
          data: { message: 'Internal Server Error' }
        }
      };
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(todoAPI.getAllTodos()).rejects.toEqual(mockError);
    });

    test('should handle unauthorized errors (401)', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      };
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(todoAPI.getAllTodos()).rejects.toEqual(mockError);
    });

    test('should handle forbidden errors (403)', async () => {
      const mockError = {
        response: {
          status: 403,
          data: { message: 'Forbidden' }
        }
      };
      mockedAxios.post.mockRejectedValue(mockError);

      await expect(todoAPI.createTodo(mockTodoFormData)).rejects.toEqual(mockError);
    });
  });

  describe('Request/Response Interceptors', () => {
    test('should include proper headers in requests', async () => {
      const mockResponse = { data: mockTodos };
      mockedAxios.get.mockResolvedValue(mockResponse);

      await todoAPI.getAllTodos();

      expect(mockedAxios.get).toHaveBeenCalledWith('/todos');
      // Verify that the axios instance was created with proper headers
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: expect.any(String),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    test('should handle response data correctly', async () => {
      const mockResponse = { 
        data: mockTodos,
        status: 200,
        statusText: 'OK'
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await todoAPI.getAllTodos();

      expect(result).toEqual(mockTodos);
    });
  });

  describe('Concurrent Requests', () => {
    test('should handle multiple concurrent getAllTodos requests', async () => {
      const mockResponse = { data: mockTodos };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const promises = [
        todoAPI.getAllTodos(),
        todoAPI.getAllTodos(),
        todoAPI.getAllTodos()
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toEqual(mockTodos);
      });
      expect(mockedAxios.get).toHaveBeenCalledTimes(3);
    });

    test('should handle concurrent create and delete operations', async () => {
      const createResponse = { data: { todo_id: 4, ...mockTodoFormData } };
      const deleteResponse = { data: { message: 'Todo deleted successfully' } };
      
      mockedAxios.post.mockResolvedValue(createResponse);
      mockedAxios.delete.mockResolvedValue(deleteResponse);

      const [createResult, deleteResult] = await Promise.all([
        todoAPI.createTodo(mockTodoFormData),
        todoAPI.deleteTodo(1)
      ]);

      expect(createResult).toEqual(createResponse.data);
      expect(deleteResult).toEqual(deleteResponse.data);
    });
  });
});
