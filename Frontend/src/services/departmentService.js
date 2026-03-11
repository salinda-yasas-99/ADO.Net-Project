import api from './api';

const ENDPOINT = '/departments';

/**
 * Department Service
 * Handles all API operations for departments
 */
const departmentService = {
  /**
   * Get all departments
   * @returns {Promise<{success: boolean, message: string, data: Array}>}
   */
  getAll: async () => {
    const response = await api.get(ENDPOINT);
    return response.data;
  },

  /**
   * Get department by ID
   * @param {number} id - Department ID
   * @returns {Promise<{success: boolean, message: string, data: Object}>}
   */
  getById: async (id) => {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Create a new department
   * @param {Object} department - Department data
   * @param {string} department.departmentCode - Unique department code
   * @param {string} department.departmentName - Department name
   * @returns {Promise<{success: boolean, message: string, data: Object}>}
   */
  create: async (department) => {
    const response = await api.post(ENDPOINT, department);
    return response.data;
  },

  /**
   * Update an existing department
   * @param {number} id - Department ID
   * @param {Object} department - Updated department data
   * @param {string} department.departmentCode - Unique department code
   * @param {string} department.departmentName - Department name
   * @returns {Promise<{success: boolean, message: string, data: Object}>}
   */
  update: async (id, department) => {
    const response = await api.put(`${ENDPOINT}/${id}`, department);
    return response.data;
  },

  /**
   * Delete a department
   * @param {number} id - Department ID
   * @returns {Promise<{success: boolean, message: string}>}
   */
  delete: async (id) => {
    const response = await api.delete(`${ENDPOINT}/${id}`);
    return response.data;
  },
};

export default departmentService;
