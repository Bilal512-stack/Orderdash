import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://mta-backend-production-1342.up.railway.app';
console.log("✅ BACKEND_URL (axiosConfig):", BACKEND_URL);

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

