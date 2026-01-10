import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://iraqi-e-store-api.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request Interceptor: Add token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Refresh token automatically on expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authRoutes = ['/auth/login', '/auth/register', '/auth/admin/login'];

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !authRoutes.includes(originalRequest.url)
    ) {
      originalRequest._retry = true;
      
      try {
        const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
        const refreshPath = isAdminPath ? '/auth/adminrefresh' : '/auth/refresh';

        const { data } = await axios.post(`${API_BASE_URL}${refreshPath}`, {}, { withCredentials: true });
        
        if (data?.accessToken) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', data.accessToken);
          }
          api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          if (window.location.pathname.startsWith('/admin')) {
             window.location.href = '/admin/login';
          } else {
             localStorage.removeItem('accessToken');
             localStorage.removeItem('refreshToken');
             // We don't redirect automatically in the store
             // Components are responsible for redirecting if an action requires login
          }
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;