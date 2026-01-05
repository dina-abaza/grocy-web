"use client"; // مهم جدًا

import { useEffect } from "react"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "@/app/(shop)/store/useAuthStore"; 



export default function Providers({ children }) {
  
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen bg-white">
           <p className="text-lg font-bold">جاري التحقق من الجلسة...</p>
        </div>
      ) : (
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
      )}
    </>
  );
}
