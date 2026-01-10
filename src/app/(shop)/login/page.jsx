"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useLogin } from "../store/useAuth";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();
  const { mutate: login, isLoading } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form, {
      onSuccess: () => {
        toast.success("تم تسجيل الدخول بنجاح");
        router.push("/");
      },
      onError: (error) => {
        const msg = error.response?.data?.message || "البريد أو كلمة المرور غير صحيحة";
        toast.error(msg);
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="bg-white w-full max-w-lg p-10 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">تسجيل الدخول</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            className="w-full rounded-2xl px-5 py-4 text-gray-700 bg-gray-100 placeholder-gray-400 shadow-inner outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            className="w-full rounded-2xl px-5 py-4 text-gray-700 bg-gray-100 placeholder-gray-400 shadow-inner outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button 
            disabled={isLoading}
            className={`w-full mt-6 text-white font-bold py-4 rounded-2xl shadow-lg transition-all ${isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 active:scale-95'}`}
          >
            {isLoading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>

        <GoogleSignInButton />

        <p className="text-sm text-center mt-6 text-gray-500">
          معندكش حساب؟{" "}
          <Link href="/register" className="text-green-600 font-semibold hover:underline">
            إنشاء حساب
          </Link>
        </p>
      </div>
    </div>
  );
}
