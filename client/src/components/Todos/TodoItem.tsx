import { useState } from 'react';
import toast from 'react-hot-toast';
import { todosApi } from '../../services/api';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: string;
  createdAt: string;
}

interface Props {
  todo: Todo;
  onUpdate: () => void;
}

export default function TodoItem({ todo, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [loading, setLoading] = useState(false);

  const toggleComplete = async () => {
    try {
      await todosApi.update(todo.id, { completed: !todo.completed });
      onUpdate();
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await todosApi.delete(todo.id);
      toast.success('Todo deleted');
      onUpdate();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!title.trim()) return;
    try {
      await todosApi.update(todo.id, { title });
      setEditing(false);
      onUpdate();
    } catch {
      toast.error('Failed to update');
    }
  };

  const priorityEmoji = { low: '🟢', medium: '🟡', high: '🔴' }[todo.priority] || '🟡';

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-left">
        <button onClick={toggleComplete} className="todo-checkbox" aria-label="Toggle complete">
          {todo.completed ? '✅' : '⬜'}
        </button>
        <div className="todo-content">
          {editing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
              autoFocus
              className="todo-edit-input"
            />
          ) : (
            <>
              <span className="todo-title" onDoubleClick={() => setEditing(true)}>
                {todo.title}
              </span>
              {todo.description && (
                <span className="todo-description">{todo.description}</span>
              )}
            </>
          )}
        </div>
      </div>
      <div className="todo-right">
        <span className="todo-priority">{priorityEmoji}</span>
        <button onClick={() => setEditing(!editing)} className="btn btn-icon" aria-label="Edit">
          ✏️
        </button>
        <button onClick={handleDelete} className="btn btn-icon btn-danger" disabled={loading} aria-label="Delete">
          🗑️
        </button>
      </div>
    </div>
  );
}
