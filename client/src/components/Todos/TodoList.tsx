import { useState, useEffect, useCallback } from 'react';
import { todosApi } from '../../services/api';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: string;
  createdAt: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const fetchTodos = useCallback(async () => {
    try {
      const res = await todosApi.getAll(1, 100);
      setTodos(res.data.data);
    } catch {
      console.error('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  const filtered = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;

  if (loading) {
    return <div className="loading-screen"><div className="spinner" /></div>;
  }

  return (
    <div className="todo-container">
      <AddTodo onTodoAdded={fetchTodos} />

      <div className="todo-filters">
        <button onClick={() => setFilter('all')} className={`filter-btn ${filter === 'all' ? 'active' : ''}`}>
          All ({todos.length})
        </button>
        <button onClick={() => setFilter('active')} className={`filter-btn ${filter === 'active' ? 'active' : ''}`}>
          Active ({todos.length - completedCount})
        </button>
        <button onClick={() => setFilter('completed')} className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}>
          Done ({completedCount})
        </button>
      </div>

      <div className="todo-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📝</span>
            <p>{filter === 'all' ? 'No todos yet. Add one above!' : `No ${filter} todos.`}</p>
          </div>
        ) : (
          filtered.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
          ))
        )}
      </div>
    </div>
  );
}
