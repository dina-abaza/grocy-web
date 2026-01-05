"use client";

import { useEffect } from "react"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "@/app/(shop)/store/useAuthStore";
import { usePathname } from "next/navigation"; 

export default function Providers({ children }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const loading = useAuthStore((state) => state.loading);
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith('/admin')) {
      checkAuth();
    }
  }, [checkAuth, pathname]);

  if (loading && !pathname.startsWith('/admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-lg font-bold">جاري التحقق من الجلسة...</p>
      </div>
    );
  }

  return (
    <>
      {children}
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
        closeOnClick
        rtl
        pauseOnHover={false}
        theme="light"
      />
    </>
  );
}
