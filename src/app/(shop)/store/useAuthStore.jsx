import { create } from 'zustand';
import api from '@/app/api';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false, // 👈 أضفنا هذا السطر ليعمل الـ Navbar
  loading: true,

  checkAuth: async () => {
    set({ loading: true });
    try {
      const res = await api.post('/auth/verify');
      // 👈 نحدث user و isAuthenticated معاً عند النجاح
      set({ 
        user: res.data.user, 
        isAuthenticated: true, 
        loading: false 
      });
    } catch (error) {
      // 👈 في حالة الفشل نلغي الحالة
      set({ 
        user: null, 
        isAuthenticated: false, 
        loading: false 
      });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null, isAuthenticated: false }); // مسح البيانات
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout failed", error);
    }
  }
}));