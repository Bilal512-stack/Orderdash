import axios from 'axios';

// URL backend Railway, à définir dans .env : REACT_APP_API_URL
const BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Intercepteur pour ajouter le token dans les headers automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    } else {
      console.warn('⚠️ Aucun token trouvé dans axiosConfig');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
