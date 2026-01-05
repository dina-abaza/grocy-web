// app/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://iraqi-e-store-api.vercel.app/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // إذا كان الخطأ 401 (توكن منتهي)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // فحص هل المستخدم في صفحة أدمن أم شوب
        const isAdminPath = window.location.pathname.startsWith('/admin');
        const refreshPath = isAdminPath ? '/auth/adminrefresh' : '/auth/refresh';

        await axios.post(`https://iraqi-e-store-api.vercel.app/api${refreshPath}`, {}, { withCredentials: true });
        
        return api(originalRequest); // إعادة الطلب الأصلي
      } catch (refreshError) {
        // 🚨 التعديل المهم هنا:
        // لا تحول للوجن إلا لو كان المسار يبدأ بـ /admin 
        // أو إذا كان الطلب نفسه موجه لصفحة محمية
        if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin/login';
        }
        // في حالة الشوب، نكتفي برفض الطلب دون تحويل الصفحة (عشان الرئيسيه تفتح عادي)
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;