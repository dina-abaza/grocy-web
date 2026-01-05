"use client";

import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import api from "../axios";

export const useAuthInterceptor = () => {
  const { clearUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes("/refresh-token")
        ) {
          originalRequest._retry = true;

          try {
            const res = await api.post("/api/auth/refresh-token", { client: "web" });
            const newAccessToken = res.data?.accessToken;
            if (newAccessToken) {
              localStorage.setItem("accessToken", newAccessToken);
              originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            clearUser();
            toast.error("انتهت صلاحية الجلسة، سجّل الدخول مرة أخرى");
            router.push("/login");
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [router, clearUser]);
};
