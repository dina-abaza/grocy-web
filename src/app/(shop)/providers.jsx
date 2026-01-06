"use client";

import { useEffect } from "react"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "@/app/(shop)/store/useAuthStore";
import { usePathname } from "next/navigation"; 
import Activity from "@/app/loading";

export default function Providers({ children }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const loading = useAuthStore((state) => state.loading);
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith('/admin')) {
      checkAuth();
    }
  }, [checkAuth, pathname]);

  return (
    <>
      {/* هنا الناف يفضل دايمًا موجود */}
      {children}

      {/* Loader يظهر فقط في منطقة المحتوى */}
      {loading && !pathname.startsWith('/admin') && (
        <div className="fixed top-[80px] bottom-0 left-0 right-0 flex items-center justify-center bg-white/70 z-50">
          <Activity />
        </div>
      )}

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
