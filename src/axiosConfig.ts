import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://mta-backend-production-1342.up.railway.app/api',
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ Aucun token trouvé dans axiosConfig');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
