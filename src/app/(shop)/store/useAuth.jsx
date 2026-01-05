import { useMutation } from "@tanstack/react-query";
import api from "@/app/(shop)/axios";
import { useAuthStore } from "./useAuthStore";

/* ================= LOGIN ================= */
export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await api.post("/api/auth/login", { email, password, client: "web" });

      console.log("Login Response:", res.data);

      if (res.data.tokens) {
        localStorage.setItem("accessToken", res.data.tokens.accessToken);
        localStorage.setItem("refreshToken", res.data.tokens.refreshToken);
      } else {
        console.warn("لا يوجد توكنز في الاستجابة!");
      }

      return res.data;
    },

    onSuccess: (data) => {
      if (data.user) {
        setUser({ email: data.user.email, username: data.user.username });
      }
    },

    onError: (err) => {
      console.error("Login Error:", err.response?.data || err.message);
    },
  });
};

/* ================= REGISTER ================= */
export const useRegister = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async ({ username, email, password, client }) => {
      const res = await api.post("/api/auth/register", { username, email, password, client });

      console.log("Register Response:", res.data);

      return res.data;
    },

    onSuccess: (data) => {
      if (data.user) {
        setUser({ email: data.user.email, username: data.user.username });
      }
    },

    onError: (err) => {
      console.error("Register Error:", err.response?.data || err.message);
    },
  });
};
