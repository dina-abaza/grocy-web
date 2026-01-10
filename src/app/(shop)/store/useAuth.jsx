import { useMutation } from "@tanstack/react-query";
import api from "@/app/api";
import { useAuthStore } from "./useAuthStore";

/* ================= LOGIN ================= */
export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await api.post("/auth/login", { email, password });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.tokens) {
        localStorage.setItem("accessToken", data.tokens.accessToken);
        localStorage.setItem("refreshToken", data.tokens.refreshToken);
      }
      if (data.user) {
        setUser(data.user);
      }
    },
    onError: (err) => {
      console.error("Login Error:", err.response?.data || err.message);
    },
  });
};

/* ================= REGISTER ================= */
export const useRegister = () => {
  return useMutation({
    mutationFn: async ({ username, email, password }) => {
      const res = await api.post("/auth/register", { username, email, password });
      return res.data;
    },
    onError: (err) => {
      console.error("Register Error:", err.response?.data || err.message);
    },
  });
};
