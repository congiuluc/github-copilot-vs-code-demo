import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Plus, 
  Search, 
  ListTodo,
  Edit2,
  X
} from 'lucide-react';
import { todoApi } from './api';
import { Todo, CreateTodoRequest } from './types';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [newTodo, setNewTodo] = useState<CreateTodoRequest>({
    title: '',
    description: '',
  });

  // Load todos on mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await todoApi.getTodos();
      setTodos(data);
    } catch (error) {
      toast.error('Failed to load todos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      const created = await todoApi.createTodo(newTodo);
      setTodos([created, ...todos]);
      setNewTodo({ title: '', description: '' });
      setShowAddModal(false);
      toast.success('Todo created successfully! 🎉');
    } catch (error) {
      toast.error('Failed to create todo');
      console.error(error);
    }
  };

  const handleUpdateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo) return;

    try {
      const updated = await todoApi.updateTodo(editingTodo.id, {
        title: editingTodo.title,
        description: editingTodo.description,
        isCompleted: editingTodo.isCompleted,
      });
      setTodos(todos.map(t => t.id === updated.id ? updated : t));
      setEditingTodo(null);
      toast.success('Todo updated successfully! ✅');
    } catch (error) {
      toast.error('Failed to update todo');
      console.error(error);
    }
  };

  const handleToggleTodo = async (id: number) => {
    try {
      const updated = await todoApi.toggleTodo(id);
      setTodos(todos.map(t => t.id === updated.id ? updated : t));
      toast.success(updated.isCompleted ? 'Todo completed! 🎊' : 'Todo reopened');
    } catch (error) {
      toast.error('Failed to toggle todo');
      console.error(error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await todoApi.deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
      toast.success('Todo deleted successfully! 🗑️');
    } catch (error) {
      toast.error('Failed to delete todo');
      console.error(error);
    }
  };

  // Filter todos based on filter and search
  const filteredTodos = todos.filter(todo => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'active' ? !todo.isCompleted :
      todo.isCompleted;

    const matchesSearch = 
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.isCompleted).length,
    completed: todos.filter(t => t.isCompleted).length,
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-effect rounded-2xl p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
                <ListTodo className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Todo List Manager
                </h1>
                <p className="text-gray-600 text-sm">Stay organized and productive</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Todo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <p className="text-blue-600 text-sm font-medium">Total</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
              <p className="text-amber-600 text-sm font-medium">Active</p>
              <p className="text-2xl font-bold text-amber-700">{stats.active}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <p className="text-green-600 text-sm font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="glass-effect rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search todos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'active'
                    ? 'bg-amber-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'completed'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Todo List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading todos...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="glass-effect rounded-xl p-12 text-center">
            <ListTodo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No todos found</p>
            <p className="text-gray-500 text-sm mt-2">
              {searchQuery ? 'Try a different search term' : 'Create your first todo to get started!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <div key={todo.id} className="todo-card">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleTodo(todo.id)}
                    className="mt-1 flex-shrink-0 transition-all hover:scale-110"
                  >
                    {todo.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-blue-500" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-semibold ${
                      todo.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}>
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className={`text-sm mt-1 ${
                        todo.isCompleted ? 'line-through text-gray-400' : 'text-gray-600'
                      }`}>
                        {todo.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {new Date(todo.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingTodo(todo)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-5 h-5 text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Todo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-effect rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Create New Todo</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTodo}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter todo title..."
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTodo.description}
                    onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Enter todo description..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn-primary flex-1">
                  Create Todo
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Todo Modal */}
      {editingTodo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-effect rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Edit Todo</h2>
              <button
                onClick={() => setEditingTodo(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateTodo}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={editingTodo.title}
                    onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter todo title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingTodo.description || ''}
                    onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Enter todo description..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="completed"
                    checked={editingTodo.isCompleted}
                    onChange={(e) => setEditingTodo({ ...editingTodo, isCompleted: e.target.checked })}
                    className="w-5 h-5 rounded text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="completed" className="text-sm font-medium text-gray-700">
                    Mark as completed
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn-primary flex-1">
                  Update Todo
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTodo(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
