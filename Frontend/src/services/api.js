import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7225/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
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
