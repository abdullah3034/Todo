import React, { useState } from 'react';

const TodoForm = ({ onAddTodo }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in both title and description');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddTodo(formData);
      setFormData({ title: '', description: '', priority: 'medium', category: 'general' });
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg">✨</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          Add New Todo
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            📝 Todo Title
          </label>
          <div className="relative">
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 placeholder-gray-400"
              placeholder="What needs to be done?"
              disabled={isSubmitting}
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-400">💭</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            📋 Description
          </label>
          <div className="relative">
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 resize-none placeholder-gray-400"
              rows="4"
              placeholder="Add some details about this task..."
              disabled={isSubmitting}
              required
            />
            <div className="absolute top-3 right-3">
              <span className="text-gray-400">📝</span>
            </div>
          </div>
        </div>
        
        {/* Priority and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
              ⚡ Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
              disabled={isSubmitting}
            >
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🔴 High Priority</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
              🏷️ Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
              disabled={isSubmitting}
            >
              <option value="general">📝 General</option>
              <option value="work">💼 Work</option>
              <option value="personal">🏠 Personal</option>
              <option value="shopping">🛒 Shopping</option>
              <option value="health">💪 Health</option>
              <option value="learning">📚 Learning</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`group relative inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                Creating Magic...
              </span>
            ) : (
              <>
                <span className="mr-2">🚀</span>
                Create Todo
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;
