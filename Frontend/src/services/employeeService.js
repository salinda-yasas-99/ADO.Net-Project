import api from './api';

const ENDPOINT = '/users';

/**
 * Employee Service
 * Handles all API operations for employees (users)
 */
const employeeService = {
  /**
   * Get all employees
   * @returns {Promise<{success: boolean, message: string, data: Array}>}
   */
  getAll: async () => {
    const response = await api.get(ENDPOINT);
    return response.data;
  },

  /**
   * Get employee by ID
   * @param {number} id - Employee ID
   * @returns {Promise<{success: boolean, message: string, data: Object}>}
   */
  getById: async (id) => {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Create a new employee
   * @param {Object} employee - Employee data
   * @param {string} employee.firstName - First name
   * @param {string} employee.lastName - Last name
   * @param {string} employee.emailAddress - Email address
   * @param {string} employee.dateOfBirth - Date of birth (ISO format)
   * @param {number} employee.salary - Salary
   * @param {number} employee.departmentId - Department ID
   * @returns {Promise<{success: boolean, message: string, data: Object}>}
   */
  create: async (employee) => {
    const response = await api.post(ENDPOINT, employee);
    return response.data;
  },

  /**
   * Update an existing employee
   * @param {number} id - Employee ID
   * @param {Object} employee - Updated employee data
   * @param {string} employee.firstName - First name
   * @param {string} employee.lastName - Last name
   * @param {string} employee.emailAddress - Email address
   * @param {string} employee.dateOfBirth - Date of birth (ISO format)
   * @param {number} employee.salary - Salary
   * @param {number} employee.departmentId - Department ID
   * @returns {Promise<{success: boolean, message: string, data: Object}>}
   */
  update: async (id, employee) => {
    const response = await api.put(`${ENDPOINT}/${id}`, employee);
    return response.data;
  },

  /**
   * Delete an employee
   * @param {number} id - Employee ID
   * @returns {Promise<{success: boolean, message: string}>}
   */
  delete: async (id) => {
    const response = await api.delete(`${ENDPOINT}/${id}`);
    return response.data;
  },
};

export default employeeService;
