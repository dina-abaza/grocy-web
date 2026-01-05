import { create } from "zustand";
import api from "@/app/api";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  checkAuth: async () => {
    set({ loading: true });
    try {
      // 👈 المسار الصح
      const res = await api.get("/auth/me");

      set({
        user: res.data, // 👈 هنا المستخدم الحقيقي
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  logout: async () => {
    await api.post("/auth/logout");
    set({ user: null, isAuthenticated: false });
    window.location.href = "/login";
  },
}));
