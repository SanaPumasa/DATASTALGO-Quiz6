import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    console.log('Attaching Bearer token to request:', config.url);
    console.log('Token (first 50 chars):', token.substring(0, 50) + '...');
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log('No token in localStorage for request:', config.url);
  }
  
  if (config.data && !(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    } else if (error.response?.status === 403) {
      console.error('403 Forbidden:', error.response?.data);
    }
    return Promise.reject(error);
  }
);

export default api;
