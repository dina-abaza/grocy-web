"use client";
import { useState } from "react";
import api from "@/app/api";
import { useAdminAuthStore } from "../store/useAdminAuthStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const verifyAdmin = useAdminAuthStore((state) => state.verifyAdmin);
  const router = useRouter();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      // استخدام مسار loginadmin الخاص بالخلفية
      await api.post("/auth/loginadmin", { email, password, client: "web" });
      await verifyAdmin(); // سيقوم بتغيير حالة admin في الـ Store وبالتالي يفتح الـ Layout
      toast.success("مرحباً بك في لوحة التحكم");
      router.push('/admin');

    } catch (error) {
      toast.error("صلاحيات غير كافية أو بيانات خاطئة");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <form onSubmit={handleAdminLogin} className="bg-white p-10 rounded shadow-lg w-96">
        <h1 className="text-xl font-bold mb-4 text-center text-red-600">لوحة تحكم الادارة</h1>
        <div className="space-y-4">
          <input 
            type="email" placeholder="بريد المسؤول" 
            className="w-full p-3 border rounded-2xl "
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" placeholder="كلمة السر" 
            className="w-full p-3 border rounded-2xl "
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button className="w-full bg-gray-800 text-white p-3 rounded font-bold transition-colors hover:bg-gray-900">
            تسجيل دخول الإدارة
          </button>
        </div>
      </form>
    </div>
  );
}