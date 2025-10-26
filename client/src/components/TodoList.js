import React from 'react';

const TodoList = ({ todos, onMarkAsDone, onRefresh }) => {
  if (todos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <span className="text-4xl">📝</span>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
            <span className="text-sm">✨</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-3">No todos yet</h3>
        <p className="text-gray-500 text-lg max-w-sm mx-auto">
          Your productivity journey starts here! Create your first todo and watch the magic happen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo, index) => (
        <div
          key={todo.todo_id}
          className="group bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 transform hover:-translate-y-1"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
                      {todo.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {/* Priority Badge */}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        (todo.priority || 'medium') === 'high' ? 'bg-red-100 text-red-700' :
                        (todo.priority || 'medium') === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {(todo.priority || 'medium') === 'high' ? '🔴 High' :
                         (todo.priority || 'medium') === 'medium' ? '🟡 Medium' : '🟢 Low'}
                      </span>
                      
                      {/* Category Badge */}
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {(todo.category || 'general') === 'work' ? '💼 Work' :
                         (todo.category || 'general') === 'personal' ? '🏠 Personal' :
                         (todo.category || 'general') === 'shopping' ? '🛒 Shopping' :
                         (todo.category || 'general') === 'health' ? '💪 Health' :
                         (todo.category || 'general') === 'learning' ? '📚 Learning' : '📝 General'}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {todo.description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 ml-6">
              <button
                onClick={() => onMarkAsDone(todo.todo_id)}
                className="group/btn bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center space-x-2"
                title="Mark as done"
              >
                <span className="text-lg">✅</span>
                <span>Done</span>
                <span className="group-hover/btn:translate-x-1 transition-transform duration-200">→</span>
              </button>
            </div>
          </div>
        </div>
      ))}
      
    </div>
  );
};

export default TodoList;
