import { Todo, CreateTodoRequest, UpdateTodoRequest } from './types';

const API_BASE_URL = '/api';

export const todoApi = {
  // Get all todos
  getTodos: async (): Promise<Todo[]> => {
    const response = await fetch(`${API_BASE_URL}/todos`);
    if (!response.ok) throw new Error('Failed to fetch todos');
    return response.json();
  },

  // Get todo by ID
  getTodoById: async (id: number): Promise<Todo> => {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`);
    if (!response.ok) throw new Error('Failed to fetch todo');
    return response.json();
  },

  // Create new todo
  createTodo: async (data: CreateTodoRequest): Promise<Todo> => {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create todo');
    return response.json();
  },

  // Update todo
  updateTodo: async (id: number, data: UpdateTodoRequest): Promise<Todo> => {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update todo');
    return response.json();
  },

  // Toggle todo completion
  toggleTodo: async (id: number): Promise<Todo> => {
    const response = await fetch(`${API_BASE_URL}/todos/${id}/toggle`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to toggle todo');
    return response.json();
  },

  // Delete todo
  deleteTodo: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete todo');
  },

  // Filter todos
  filterTodos: async (completed?: boolean, search?: string): Promise<Todo[]> => {
    const params = new URLSearchParams();
    if (completed !== undefined) params.append('completed', String(completed));
    if (search) params.append('search', search);
    
    const response = await fetch(`${API_BASE_URL}/todos/filter?${params}`);
    if (!response.ok) throw new Error('Failed to filter todos');
    return response.json();
  },
};
