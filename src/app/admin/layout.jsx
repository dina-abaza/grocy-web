"use client";
import Providers from "../(shop)/providers";
import { useEffect, useState } from "react";
import { useAdminAuthStore } from "./store/useAdminAuthStore";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "./components/sidebar";
import AdminTopbar from "./components/navbar";
import AdminLogin from "./login/page";

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

  if (loading && pathname !== '/admin/login') return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <p className="text-lg font-bold">جاري التحقق من الجلسة...</p>
    </div>
  );

  // لو الصفحة الحالية هي صفحة اللوجن، نعرضها بدون Layout
  if (pathname === "/admin/login") {
    return <Providers>{children}</Providers>;
  }

  return (
    <Providers>
      <div className="flex min-h-screen bg-gray-100 rtl dark:bg-gray-900">
        <AdminSidebar disabled={!admin} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="flex-1 flex flex-col transition-all duration-300 ease-in-out ltr:ml-0 rtl:mr-0 md:ltr:ml-64 md:rtl:mr-64">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden fixed top-4 ltr:left-4 rtl:right-4 z-50 p-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <AdminTopbar />
          <section className="p-4 md:p-8">
            {admin ? children : null}
          </section>
        </main>
      </div>

    </Providers>
  );
}
