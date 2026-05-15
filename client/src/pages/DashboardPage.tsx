import Navbar from '../components/Layout/Navbar';
import TodoList from '../components/Todos/TodoList';

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2>My Todos</h2>
          <p>Organize your tasks with style</p>
        </div>
        <TodoList />
      </main>
    </div>
  );
}
