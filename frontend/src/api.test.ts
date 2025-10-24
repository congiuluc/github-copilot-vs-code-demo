import { describe, it, expect, beforeEach, vi } from 'vitest';
import { todoApi } from './api';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from './types';

// Mock the global fetch function
global.fetch = vi.fn();

describe('todoApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTodos', () => {
    it('should fetch all todos successfully', async () => {
      const mockTodos: Todo[] = [
        {
          id: 1,
          title: 'Test Todo 1',
          description: 'Description 1',
          isCompleted: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 2,
          title: 'Test Todo 2',
          isCompleted: true,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodos,
      });

      const result = await todoApi.getTodos();

      expect(global.fetch).toHaveBeenCalledWith('/api/todos');
      expect(result).toEqual(mockTodos);
    });

    it('should throw error when fetch fails', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
      });

      await expect(todoApi.getTodos()).rejects.toThrow('Failed to fetch todos');
    });
  });

  describe('getTodoById', () => {
    it('should fetch a todo by id successfully', async () => {
      const mockTodo: Todo = {
        id: 1,
        title: 'Test Todo',
        description: 'Test Description',
        isCompleted: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodo,
      });

      const result = await todoApi.getTodoById(1);

      expect(global.fetch).toHaveBeenCalledWith('/api/todos/1');
      expect(result).toEqual(mockTodo);
    });

    it('should throw error when fetch fails', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
      });

      await expect(todoApi.getTodoById(1)).rejects.toThrow('Failed to fetch todo');
    });
  });

  describe('createTodo', () => {
    it('should create a new todo successfully', async () => {
      const createRequest: CreateTodoRequest = {
        title: 'New Todo',
        description: 'New Description',
      };

      const mockCreatedTodo: Todo = {
        id: 1,
        title: 'New Todo',
        description: 'New Description',
        isCompleted: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreatedTodo,
      });

      const result = await todoApi.createTodo(createRequest);

      expect(global.fetch).toHaveBeenCalledWith('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createRequest),
      });
      expect(result).toEqual(mockCreatedTodo);
    });

    it('should create a todo without description', async () => {
      const createRequest: CreateTodoRequest = {
        title: 'New Todo',
      };

      const mockCreatedTodo: Todo = {
        id: 1,
        title: 'New Todo',
        isCompleted: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreatedTodo,
      });

      const result = await todoApi.createTodo(createRequest);

      expect(result).toEqual(mockCreatedTodo);
    });

    it('should throw error when create fails', async () => {
      const createRequest: CreateTodoRequest = {
        title: 'New Todo',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
      });

      await expect(todoApi.createTodo(createRequest)).rejects.toThrow('Failed to create todo');
    });
  });

  describe('updateTodo', () => {
    it('should update a todo successfully', async () => {
      const updateRequest: UpdateTodoRequest = {
        title: 'Updated Todo',
        description: 'Updated Description',
        isCompleted: true,
      };

      const mockUpdatedTodo: Todo = {
        id: 1,
        title: 'Updated Todo',
        description: 'Updated Description',
        isCompleted: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdatedTodo,
      });

      const result = await todoApi.updateTodo(1, updateRequest);

      expect(global.fetch).toHaveBeenCalledWith('/api/todos/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateRequest),
      });
      expect(result).toEqual(mockUpdatedTodo);
    });

    it('should throw error when update fails', async () => {
      const updateRequest: UpdateTodoRequest = {
        title: 'Updated Todo',
        isCompleted: false,
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
      });

      await expect(todoApi.updateTodo(1, updateRequest)).rejects.toThrow('Failed to update todo');
    });
  });

  describe('toggleTodo', () => {
    it('should toggle a todo successfully', async () => {
      const mockToggledTodo: Todo = {
        id: 1,
        title: 'Test Todo',
        isCompleted: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockToggledTodo,
      });

      const result = await todoApi.toggleTodo(1);

      expect(global.fetch).toHaveBeenCalledWith('/api/todos/1/toggle', {
        method: 'PATCH',
      });
      expect(result).toEqual(mockToggledTodo);
    });

    it('should throw error when toggle fails', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
      });

      await expect(todoApi.toggleTodo(1)).rejects.toThrow('Failed to toggle todo');
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo successfully', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
      });

      await todoApi.deleteTodo(1);

      expect(global.fetch).toHaveBeenCalledWith('/api/todos/1', {
        method: 'DELETE',
      });
    });

    it('should throw error when delete fails', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
      });

      await expect(todoApi.deleteTodo(1)).rejects.toThrow('Failed to delete todo');
    });
  });

  describe('filterTodos', () => {
    it('should filter todos by completed status', async () => {
      const mockTodos: Todo[] = [
        {
          id: 1,
          title: 'Completed Todo',
          isCompleted: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodos,
      });

      const result = await todoApi.filterTodos(true);

      expect(global.fetch).toHaveBeenCalledWith('/api/todos/filter?completed=true');
      expect(result).toEqual(mockTodos);
    });

    it('should filter todos by search term', async () => {
      const mockTodos: Todo[] = [
        {
          id: 1,
          title: 'Search Term',
          isCompleted: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodos,
      });

      const result = await todoApi.filterTodos(undefined, 'Search');

      expect(global.fetch).toHaveBeenCalledWith('/api/todos/filter?search=Search');
      expect(result).toEqual(mockTodos);
    });

    it('should filter todos by both completed and search', async () => {
      const mockTodos: Todo[] = [
        {
          id: 1,
          title: 'Search Todo',
          isCompleted: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodos,
      });

      const result = await todoApi.filterTodos(false, 'Search');

      expect(global.fetch).toHaveBeenCalledWith('/api/todos/filter?completed=false&search=Search');
      expect(result).toEqual(mockTodos);
    });

    it('should filter todos with no parameters', async () => {
      const mockTodos: Todo[] = [];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodos,
      });

      const result = await todoApi.filterTodos();

      expect(global.fetch).toHaveBeenCalledWith('/api/todos/filter?');
      expect(result).toEqual(mockTodos);
    });

    it('should throw error when filter fails', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
      });

      await expect(todoApi.filterTodos()).rejects.toThrow('Failed to filter todos');
    });
  });
});
