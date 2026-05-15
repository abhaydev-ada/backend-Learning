import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen"><div className="spinner" /></div>;
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <SignupPage />} />
      <Route path="/" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1e1e2e', color: '#cdd6f4', border: '1px solid #45475a' },
        }} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
