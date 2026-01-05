"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tags,
  PackageSearch,
  Share2,
  LogOut,
} from "lucide-react";
import { useAdminAuthStore } from "../store/useAdminAuthStore";

export default function AdminSidebar({ disabled }) {
  const pathname = usePathname();
  const { logoutAdmin } = useAdminAuthStore();

  const navLinks = [
    { name: "الرئيسية", href: "/admin", icon: LayoutDashboard, color: "#ef4444" },
    { name: "الأقسام", href: "/admin/categories", icon: Tags, color: "#22c55e" },
    { name: "المنتجات", href: "/admin/products", icon: PackageSearch, color: "#3b82f6" },
    { name: "السوشيال", href: "/admin/social", icon: Share2, color: "#a855f7" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>لوحة الإدارة</h2>
        <span>إدارة المتجر</span>
      </div>

      <nav>
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          if (disabled) {
            return (
              <div key={link.href} className="nav-link disabled">
                <Icon size={20} style={{ color: "#cbd5e1" }} />
                <span>{link.name}</span>
              </div>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive ? "active" : ""}`}
            >
              <Icon size={20} style={{ color: link.color }} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {!disabled && (
        <button className="logout" onClick={logoutAdmin}>
          <LogOut size={18} />
          تسجيل خروج
        </button>
      )}

      <style jsx>{`
        .sidebar {
          width: 280px;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          color: #1e293b;
          padding: 35px 20px 25px;
          display: flex;
          flex-direction: column;
        }

        .logo h2 {
          font-weight: 500;
          font-size: 20px;
          margin-bottom: 2px;
        }

        .logo span {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 25px;
          display: block;
        }

        nav {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          color: #1e293b;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          background: #f1f5f9;
          transform: translateX(-3px);
        }

        .nav-link.active {
          background: #ef4444;
          color: white;
        }

        .nav-link.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .logout {
          margin-top: auto;
          background: #ef4444;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </aside>
  );
}
