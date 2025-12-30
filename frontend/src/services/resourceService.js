import api from './api';

// Helper to handle paginated responses
const getResults = (data) => {
  return Array.isArray(data) ? data : (data.results || []);
};

const resourceService = {
  async getAllResources(params = {}) {
    const response = await api.get('/resources/', { params });
    const data = response.data;
    // Return array directly (handle pagination)
    return getResults(data);
  },

  async getNearbyResources(lat, lon, maxDistance = 10, filters = {}) {
    const response = await api.get('/resources/nearby/', {
      params: { lat, lon, max_distance: maxDistance, ...filters },
    });
    return response.data;
  },

  async getResourceById(id) {
    const response = await api.get(`/resources/${id}/`);
    return response.data;
  },

  async createResource(resourceData) {
    const response = await api.post('/resources/', resourceData);
    return response.data;
  },

  async updateResource(id, resourceData) {
    const response = await api.put(`/resources/${id}/`, resourceData);
    return response.data;
  },

  async verifyResource(id) {
    const response = await api.post(`/resources/${id}/verify/`);
    return response.data;
  },

  async updateCapacity(id, availableCapacity, changeLog = '') {
    const response = await api.post(`/resources/${id}/update_capacity/`, {
      available_capacity: availableCapacity,
      change_log: changeLog,
    });
    return response.data;
  },

  async assignCoordinator(id, coordinatorId) {
    const response = await api.post(`/resources/${id}/assign_coordinator/`, {
      coordinator_id: coordinatorId,
    });
    return response.data;
  },

  async getStats() {
    const response = await api.get('/resources/stats/');
    return response.data;
  },

  async exportResourcesCsv() {
    const response = await api.get('/resources/export_csv/', { responseType: 'blob' });
    return response.data;
  },

  async createResourceForm(formData) {
    const response = await api.post('/resources/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getResourceUpdates(resourceId = null, limit = 10) {
    const params = { limit };
    if (resourceId) params.resource = resourceId;
    const response = await api.get('/resource-updates/', { params });
    return getResults(response.data);
  },
};

export default resourceService;
