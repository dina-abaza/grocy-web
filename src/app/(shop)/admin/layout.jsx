"use client";
import Providers from "../providers";
import { useEffect } from "react";
import { useAdminAuthStore } from "./store/useAdminAuthStore";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "./components/sidebar";
import AdminTopbar from "./components/navbar";
import AdminLogin from "./login/page";

export default function AdminLayout({ children }) {
  const { admin, loading, verifyAdmin } = useAdminAuthStore();
  const pathname = usePathname();
  const router = useRouter();

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
      <div className="admin-root">
        <AdminSidebar disabled={!admin} />
        <main className="content">
          <AdminTopbar />
          <section className="page">
            {admin ? children : null} // سيتم التعامل مع إعادة التوجيه بواسطة useEffect
          </section>
        </main>
      </div>
      <style jsx global>{`
        .admin-root { display: flex; min-height: 100vh; background: #f8fafc; direction: rtl; }
        .content { flex: 1; display: flex; flex-direction: column; }
        .page { padding: 30px; }
      `}</style>
    </Providers>
  );
}
