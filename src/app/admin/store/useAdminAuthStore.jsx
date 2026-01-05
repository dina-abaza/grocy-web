import { create } from 'zustand';
import api from '@/app/api';

export const useAdminAuthStore = create((set) => ({
  admin: null,
  loading: true,

  // دالة التأكد من صلاحية الأدمن (تستخدم في AdminLayout)
  verifyAdmin: async () => {
    try {
      const res = await api.post('/auth/verifyadmin');
      set({ admin: res.data.admin, loading: false });
    } catch (error) {
      set({ admin: null, loading: false });
    }
  },

  adminLogout: async () => {
    await api.post('/auth/logout', { client: 'web' });
    set({ admin: null });
    window.location.href = '/admin/login';
  }
}));