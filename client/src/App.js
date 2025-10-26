import React, { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { todoAPI } from './services/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const allTodos = await todoAPI.getAllTodos();
      // Sort by most recent (assuming todo_id is auto-incrementing)
      const sortedTodos = allTodos.sort((a, b) => b.todo_id - a.todo_id);
      setTodos(sortedTodos);
    } catch (err) {
      setError('Failed to fetch todos. Please check if the server is running.');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todoData) => {
    try {
      const newTodo = await todoAPI.createTodo(todoData);
      setTodos(prevTodos => [newTodo, ...prevTodos]);
    } catch (err) {
      setError('Failed to create todo. Please try again.');
      console.error('Error creating todo:', err);
    }
  };

  const markAsDone = async (todoId) => {
    try {
      await todoAPI.deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.todo_id !== todoId));
    } catch (err) {
      setError('Failed to mark todo as done. Please try again.');
      console.error('Error marking todo as done:', err);
    }
  };

  // Filter and search todos
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || (todo.priority || 'medium') === filterPriority;
    const matchesCategory = filterCategory === 'all' || (todo.category || 'general') === filterCategory;
    
    return matchesSearch && matchesPriority && matchesCategory;
  });

  // Calculate statistics
  const totalTodos = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full mb-6 shadow-lg">
              <span className="text-3xl">✨</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Todo Master
            </h1>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Transform your productivity with our beautiful and intuitive todo management system
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 rounded-xl shadow-lg animate-shake">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-red-500 text-xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Dashboard */}
          <div className="flex justify-center mb-10">
  <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 
                  p-8 w-80 hover:scale-105 hover:shadow-3xl transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-base font-medium">Total Todos</p>
        <p className="text-4xl font-extrabold text-gray-800 mt-1">{totalTodos}</p>
      </div>
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl 
                      flex items-center justify-center shadow-md">
        <span className="text-white text-2xl">📝</span>
      </div>
    </div>
  </div>
</div>


          {/* Search and Filter Controls */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">🔍 Search Todos</label>
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">⚡ Filter by Priority</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">🔴 High Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="low">🟢 Low Priority</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">🏷️ Filter by Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                >
                  <option value="all">All Categories</option>
                  <option value="general">📝 General</option>
                  <option value="work">💼 Work</option>
                  <option value="personal">🏠 Personal</option>
                  <option value="shopping">🛒 Shopping</option>
                  <option value="health">💪 Health</option>
                  <option value="learning">📚 Learning</option>
                </select>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left Column - Todo Form */}
            <div className="order-2 xl:order-1">
              <TodoForm onAddTodo={addTodo} />
            </div>

            {/* Right Column - Todo List */}
            <div className="order-1 xl:order-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">📋</span>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Your Todos
                    </h2>
                  </div>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {filteredTodos.length} found
                  </div>
                </div>
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Loading your todos...</p>
                  </div>
                ) : (
                  <TodoList 
                    todos={filteredTodos.slice(0, 5)} 
                    onMarkAsDone={markAsDone}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
