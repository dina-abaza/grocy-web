import { create } from "zustand";
import api from "@/app/api";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user, loading: false }),

  clearUser: () => set({ user: null, isAuthenticated: false, loading: false }),

  checkAuth: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/auth/me");
      set({
        user: res.data,
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
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({ user: null, isAuthenticated: false, loading: false });
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  },
}));
