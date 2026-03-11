import api from './api';

const ENDPOINT = '/Users';

const userService = {
  getAll: async () => {
    const response = await api.get(ENDPOINT);
    const result = response.data;
    if (result.success && Array.isArray(result.data)) {
      result.data.sort((a, b) => a.id - b.id);
    }
    return result;
  },

  getById: async (id) => {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  },

  create: async (user) => {
    const response = await api.post(ENDPOINT, user);
    return response.data;
  },

  update: async (id, user) => {
    const response = await api.put(`${ENDPOINT}/${id}`, user);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${ENDPOINT}/${id}`);
    return response.data;
  },
};

export default userService;
