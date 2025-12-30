import api from './api';

// Helper to handle paginated responses
const getResults = (data) => {
  return Array.isArray(data) ? data : (data.results || []);
};

const authService = {
  async register(userData) {
    const response = await api.post('/auth/register/', userData);
    if (response.data.tokens) {
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(credentials) {
    try {
      const response = await api.post('/auth/login/', credentials);
      if (response.data.tokens) {
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      // Re-throw with better error message
      const errorMessage = error.response?.data?.error || error.message || 'Login failed. Please try again.';
      throw new Error(errorMessage);
    }
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me/');
    return response.data;
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  getAllUsers() {
    return api.get('/users/').then((res) => getResults(res.data));
  },

  approveUser(id) {
    return api.post(`/users/${id}/approve/`).then((res) => res.data);
  },

  updateUser(id, payload) {
    return api.patch(`/users/${id}/`, payload).then((res) => res.data);
  },

  getCurrentUserFromStorage() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },
};

export default authService;
