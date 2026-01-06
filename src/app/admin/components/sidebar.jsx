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

export default function AdminSidebar({ disabled, isOpen, setIsOpen }) {
  const pathname = usePathname();
  const { adminLogout} = useAdminAuthStore();

  const navLinks = [
    { name: "الرئيسية", href: "/admin", icon: LayoutDashboard, color: "#ef4444" },
    { name: "الأقسام", href: "/admin/categories", icon: Tags, color: "#22c55e" },
    { name: "المنتجات", href: "/admin/products", icon: PackageSearch, color: "#3b82f6" },
    { name: "السوشيال", href: "/admin/social", icon: Share2, color: "#a855f7" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 ltr:left-0 rtl:right-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 p-8 flex flex-col transform ${isOpen ? 'ltr:translate-x-0 rtl:translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'} md:ltr:translate-x-0 md:rtl:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <button
        onClick={() => setIsOpen(false)}
        className="md:hidden absolute top-4 ltr:right-4 rtl:left-4 p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
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
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
      <div className="mb-6">
        <h2 className="font-medium text-xl mb-0.5">لوحة الإدارة</h2>
        <span className="text-sm text-gray-600 block mb-6">إدارة المتجر</span>
      </div>

      <nav className="flex flex-col gap-3">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          if (disabled) {
            return (
              <div key={link.href} className="flex items-center gap-3 p-2.5 rounded-xl text-gray-800 opacity-50 cursor-not-allowed">
                <Icon size={20} style={{ color: "#cbd5e1" }} />
                <span>{link.name}</span>
              </div>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 p-2.5 rounded-xl text-gray-800 no-underline transition-all duration-200 ease-in-out hover:bg-gray-100 hover:translate-x-[-3px] ${isActive ? "bg-red-500 text-white" : ""}`}
            >
              <Icon size={20} style={{ color: link.color }} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {!disabled && (
        <button className="mt-auto bg-red-500 text-white border-none p-3 rounded-xl cursor-pointer flex items-center gap-2 hover:bg-red-600" onClick={adminLogout}>
          <LogOut size={18} />
          تسجيل خروج
        </button>
      )}


    </aside>
  );
}
