import axios from 'axios';
import { logout, checkTokenExpiry } from './sessionManager';

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds to handle email sending
  withCredentials: true, // Include credentials for CORS
});

// Request interceptor to add auth token and check expiry
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Check if token is expired before making request
      if (!checkTokenExpiry()) {
        return Promise.reject(new Error('Token expired'));
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Check if it's a token expiry error
      if (error.response?.data?.expired || error.response?.data?.error === 'Session expired') {
        logout();
        return Promise.reject(new Error('Session expired'));
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
