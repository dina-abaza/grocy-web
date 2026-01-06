import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://iraqi-e-store-api.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ✅ 1. Request Interceptor: إضافة التوكن تلقائياً لكل الطلبات (للمتجر)
api.interceptors.request.use(
  (config) => {
    // نتحقق من وجود التوكن في التخزين المحلي (للمتجر)
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

// ✅ 2. Response Interceptor: تجديد التوكن تلقائياً عند انتهاء الصلاحية
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // إذا كان الخطأ 401 (غير مصرح) ولم يتم إعادة المحاولة بعد
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
        
        // مسارات التجديد: نستخدم /auth/adminrefresh للأدمن و /auth/refresh-token للمتجر
        const refreshPath = isAdminPath ? '/auth/adminrefresh' : '/auth/refresh-token';

        // محاولة تجديد التوكن
        const res = await axios.post(`${API_BASE_URL}${refreshPath}`, 
          { client: 'web' }, 
          { withCredentials: true }
        );
        
        // إذا رجع توكن جديد (للمتجر)، نخزنه ونحدث الهيدر
        if (res.data?.accessToken) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', res.data.accessToken);
          }
          // تحديث الهيدر للطلب المعاد
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          // تحديث الهيدر للـ instance المستقبلي
          api.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
        }

        // إعادة تنفيذ الطلب الأصلي
        return api(originalRequest); 
        
      } catch (refreshError) {
        // إذا فشل التجديد تماماً
        if (typeof window !== 'undefined') {
          if (window.location.pathname.startsWith('/admin')) {
             // توجيه الأدمن لصفحة الدخول لأن لوحة التحكم محمية بالكامل
             window.location.href = '/admin/login';
          } else {
             // مسح بيانات المتجر
             localStorage.removeItem('accessToken');
             localStorage.removeItem('refreshToken');
             
             // 🛑 هام: لا نقوم بالتوجيه التلقائي لصفحة الدخول في المتجر
             // لأن المستخدم قد يكون زائراً يتصفح فقط
             // المكونات (Components) هي المسؤولة عن توجيه المستخدم إذا حاول القيام بعمل يحتاج تسجيل دخول
          }
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;