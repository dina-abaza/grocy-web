"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Facebook, 
  Instagram, 
  MessageCircle, 
  Mail, 
  Phone, 
  Layout,
  Music,
  Share2 // استيراد أيقونة الإعدادات للعنوان
} from "lucide-react";

export default function AdminSiteSettings() {
  const [settings, setSettings] = useState({
    footerText: "",
    contactEmail: "",
    phone: "",
    facebookLink: "",
    instagramLink: "",
    whatsappLink: "",
    tiktokLink: "",
    telegramChatId: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://iraqi-e-store-api.vercel.app/api/settings");
      setSettings(res.data);
      toast.success("تم جلب إعدادات الموقع بنجاح ✅");
    } catch (err) {
      console.error("Error fetching site settings:", err.response || err.message);
      toast.error("فشل جلب إعدادات الموقع ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettings = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.put("https://iraqi-e-store-api.vercel.app/api/settings", settings, {
        withCredentials: true,
      });
      setSettings(res.data);
      toast.success("تم حفظ إعدادات الموقع بنجاح 🎉");
    } catch (err) {
      console.error("Error updating site settings:", err.response || err.message);
      toast.error("فشل حفظ الإعدادات ❌");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <ToastContainer position="bottom-right" autoClose={3000} theme="light" />

      {/* العنوان مع الأيقونة الموف الكبيرة */}
     <div className="flex items-center gap-3 pb-4 border-b border-gray-500 dark:border-gray-700 mb-8">
  <Share2 className="text-purple-600 w-8 h-8" />
  <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white">
    إعدادات السوشيال ميديا
  </h1>
</div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <form onSubmit={saveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
          
          <div className="col-span-full border-b pb-2 dark:border-gray-700">
            <h2 className="text-xl font-bold text-purple-600">المعلومات الأساسية</h2>
          </div>

          <div className="col-span-full">
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium mb-1">
              <Layout size={18} className="text-purple-500" /> نص التذييل
            </label>
            <input
              type="text"
              name="footerText"
              value={settings.footerText}
              onChange={handleChange}
              placeholder="جميع الحقوق محفوظة لمتجرنا © 2024"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium mb-1">
              <Mail size={18} className="text-purple-500" /> البريد الإلكتروني
            </label>
            <input
              type="email"
              name="contactEmail"
              value={settings.contactEmail}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium mb-1">
              <Phone size={18} className="text-purple-500" /> رقم الهاتف
            </label>
            <input
              type="tel"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white outline-none"
              required
            />
          </div>

          <div className="col-span-full border-b pb-2 dark:border-gray-700 mt-4">
            <h2 className="text-xl font-bold text-purple-600">روابط التواصل الاجتماعي</h2>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-blue-600 font-medium">
              <Facebook size={20} /> فيسبوك
            </label>
            <input
              type="url"
              name="facebookLink"
              value={settings.facebookLink}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-pink-500 font-medium">
              <Instagram size={20} /> إنستغرام
            </label>
            <input
              type="url"
              name="instagramLink"
              value={settings.instagramLink}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-green-500 font-medium">
              واتساب
            </label>
            <input
              type="url"
              name="whatsappLink"
              value={settings.whatsappLink}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
              <Music size={20} /> تيك توك
            </label>
            <input
              type="url"
              name="tiktokLink"
              value={settings.tiktokLink}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-white outline-none"
            />
          </div>

          <div className="col-span-full flex flex-col gap-2">
            <label className="flex items-center gap-2 text-blue-400 font-medium">
              <MessageCircle size={20} /> معرف دردشة التليجرام
            </label>
            <input
              type="text"
              name="telegramChatId"
              value={settings.telegramChatId}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="col-span-full p-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-purple-100 dark:shadow-none mt-4"
          >
            {submitting ? "جاري الحفظ..." : "حفظ الإعدادات"}
          </button>
        </form>
      )}
    </div>
  );
}