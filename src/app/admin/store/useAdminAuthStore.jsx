import { create } from 'zustand';
import api from '@/app/api';

export const useAdminAuthStore = create((set) => ({
  admin: null,
  loading: true,

  // تحقق من صلاحية الأدمن
  verifyAdmin: async () => {
    set({ loading: true });
    try {
      // نتحقق من صلاحية الأدمن فقط
      const res = await api.post('/auth/verifyadmin', null, { withCredentials: true });

      // إذا نجحت العملية، نعتبر المستخدم أدمن
      set({
        admin: { role: 'admin' }, // ممكن تضيفي اسم أو أي بيانات متاحة من الـ res
        loading: false,
      });
    } catch (error) {
      console.error("verifyAdmin error:", error.response?.data || error.message);
      set({ admin: null, loading: false });
    }
  },

  // تسجيل خروج الأدمن
  adminLogout: async () => {
    try {
      await api.post('/auth/logout', { client: 'web' }, { withCredentials: true });
    } finally {
      set({ admin: null });
      window.location.href = '/admin/login';
    }
  },
}));
