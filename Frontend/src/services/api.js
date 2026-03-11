import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to extract data from ApiResponse wrapper
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Extract error message from ApiResponse
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
    const errors = error.response?.data?.errors || [];
    
    const enhancedError = new Error(errorMessage);
    enhancedError.errors = errors;
    enhancedError.status = error.response?.status;
    enhancedError.originalError = error;
    
    return Promise.reject(enhancedError);
  }
);

export default api;
