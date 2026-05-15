import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Todos API
export const todosApi = {
  getAll: (page = 1, limit = 20) =>
    api.get(`/todos?page=${page}&limit=${limit}`),
  create: (data: { title: string; description?: string; priority?: string }) =>
    api.post('/todos', data),
  update: (id: string, data: any) =>
    api.put(`/todos/${id}`, data),
  delete: (id: string) =>
    api.delete(`/todos/${id}`),
};

export default api;
