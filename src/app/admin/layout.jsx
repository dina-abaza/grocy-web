"use client";
import Providers from "../(shop)/providers";
import { useEffect, useState } from "react";
import { useAdminAuthStore } from "./store/useAdminAuthStore";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "./components/sidebar";
import AdminTopbar from "./components/navbar";
import api from "@/app/api";

export default function AdminLayout({ children }) {
  const { admin, loading, verifyAdmin } = useAdminAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (admin === null && pathname !== '/admin/login') {
      verifyAdmin();
    }
  }, [admin, pathname, verifyAdmin]);

  useEffect(() => {
    if (!loading && !admin && pathname !== '/admin/login' && pathname.startsWith('/admin')) {
      router.push('/admin/login');
    }
  }, [loading, admin, pathname, router]);

  useEffect(() => {
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      let active = true;
      const refresh = async () => {
        try {
          await api.post('/auth/adminrefresh', { client: 'web' }, { withCredentials: true });
        } catch {
          if (active) router.push('/admin/login');
        }
      };
      refresh();
      const intervalId = setInterval(refresh, 5 * 60 * 1000);
      return () => {
        active = false;
        clearInterval(intervalId);
      };
    }
  }, [pathname, router]);

  if (loading && pathname !== '/admin/login') return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <p className="text-lg font-bold">جاري التحقق من الجلسة...</p>
    </div>
  );

  if (pathname === "/admin/login") {
    return <Providers>{children}</Providers>;
  }

  return (
    <Providers>
      <div className="flex min-h-screen bg-gray-100 rtl dark:bg-gray-900 overflow-hidden">
        {/* القائمة الجانبية */}
        <AdminSidebar disabled={!admin} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* الطبقة المعتمة عند فتح المنيو في الموبايل لإغلاقه عند الضغط في الخارج */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 flex flex-col transition-all duration-300 ease-in-out ltr:ml-0 rtl:mr-0 md:ltr:ml-64 md:rtl:mr-64">
          {/* زر الهمبرجر: يظهر فقط إذا كانت القائمة مغلقة */}
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden fixed top-4 ltr:left-4 rtl:right-4 z-50 p-2 bg-transparent text-gray-800 dark:text-gray-200 border-none outline-none"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <AdminTopbar />
          <section className="p-4 md:p-8">
            {admin ? children : null}
          </section>
        </main>
      </div>
    </Providers>
  );
}
