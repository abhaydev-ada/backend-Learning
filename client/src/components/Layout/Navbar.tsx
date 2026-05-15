import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">✅</span>
        <h1>Todo App</h1>
      </div>
      {user && (
        <div className="navbar-right">
          <span className="navbar-user">👋 {user.name}</span>
          <button onClick={handleLogout} className="btn btn-ghost">Logout</button>
        </div>
      )}
    </nav>
  );
}
