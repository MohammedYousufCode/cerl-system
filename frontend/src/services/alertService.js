import api from './api';

// Helper to handle paginated responses
const getResults = (data) => {
  return Array.isArray(data) ? data : (data.results || []);
};

const alertService = {
  async getActiveAlerts(region = '') {
    const params = region ? { region } : {};
    const response = await api.get('/alerts/active/', { params });
    return getResults(response.data);
  },

  async getAllAlerts() {
    const response = await api.get('/alerts/');
    return getResults(response.data);
  },

  async createAlert(alertData) {
    const response = await api.post('/alerts/', alertData);
    return response.data;
  },

  async updateAlert(id, alertData) {
    const response = await api.put(`/alerts/${id}/`, alertData);
    return response.data;
  },

  async deleteAlert(id) {
    const response = await api.delete(`/alerts/${id}/`);
    return response.data;
  },
};

export default alertService;
