"use client";
import Providers from "../(shop)/providers";
import { useEffect } from "react";
import { useAdminAuthStore } from "./store/useAdminAuthStore";
import { usePathname } from "next/navigation";
import AdminSidebar from "./components/sidebar";
import AdminTopbar from "./components/navbar";
import AdminLogin from "./login/page";

export default function AdminLayout({ children }) {
  const { admin, loading, verifyAdmin } = useAdminAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    verifyAdmin();
  }, [verifyAdmin]);

  if (loading) return null;

  // إذا كنا في صفحة اللوجن، نعرض محتواها فقط بدون الهيكل الإداري
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
            {admin ? children : <AdminLogin />}
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