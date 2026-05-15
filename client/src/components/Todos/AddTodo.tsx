import { useState } from 'react';
import toast from 'react-hot-toast';
import { todosApi } from '../../services/api';

interface Props {
  onTodoAdded: () => void;
}

export default function AddTodo({ onTodoAdded }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await todosApi.create({ title, description, priority });
      toast.success('Todo added!');
      setTitle('');
      setDescription('');
      setPriority('medium');
      onTodoAdded();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo-form">
      <div className="add-todo-inputs">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="add-todo-title"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="add-todo-desc"
        />
      </div>
      <div className="add-todo-actions">
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="priority-select">
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '...' : '+ Add'}
        </button>
      </div>
    </form>
  );
}
