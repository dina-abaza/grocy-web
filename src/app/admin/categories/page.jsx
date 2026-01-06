"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Edit2, FolderOpen, Check, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Activity from "@/app/loading";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://iraqi-e-store-api.vercel.app/api/categories", { withCredentials: true });
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      toast.error("تعذر جلب الأقسام");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // Add category
  const handleAdd = async () => {
    if (!newName.trim()) return toast.warn("أدخل اسم القسم أولاً");

    try {
      await axios.post(
        "https://iraqi-e-store-api.vercel.app/api/categories",
        { name: newName },
        { withCredentials: true }
      );
      setNewName("");
      fetchCategories();
      toast.success("تمت إضافة القسم بنجاح 🚀");
    } catch (err) {
      console.error(err);
      toast.error("فشلت عملية الإضافة");
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;

    try {
      await axios.delete(`https://iraqi-e-store-api.vercel.app/api/categories/${id}`, { withCredentials: true });
      fetchCategories();
      toast.info("تم حذف القسم");
    } catch (err) {
      console.error(err);
      toast.error("تعذر الحذف حالياً");
    }
  };

  // Start editing
  const startEdit = (id, name) => {
    setEditingId(id);
    setEditName(name);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  // Update category
  const handleUpdate = async (id) => {
    if (!editName.trim()) return toast.warn("أدخل الاسم الجديد");

    // حفظ الاسم القديم
    const original = categories.find(cat => cat._id === id)?.name;

    try {
      await axios.put(
        `https://iraqi-e-store-api.vercel.app/api/categories/${id}`,
        { name: editName },
        { withCredentials: true }
      );

      // تحديث الاسم مباشرة في الواجهة
      setCategories(prev =>
        prev.map(cat => (cat._id === id ? { ...cat, name: editName } : cat))
      );

      setEditingId(null);
      setEditName("");
      toast.success("تم تعديل القسم بنجاح");
    } catch (err) {
      console.error(err);
      toast.error("فشل تعديل القسم");
      // إعادة الاسم القديم وإلغاء التحرير
      setEditName(original);
      setEditingId(null);
    }
  };

  if (loading) return <Activity/>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 animate-in fade-in duration-500">
      <ToastContainer position="bottom-right" autoClose={3000} theme="light" />

      {/* Header */}
<div className="flex items-center border-b pb-5 dark:border-gray-700 mb-8 gap-3">
   <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-2xl shadow-md">
    <FolderOpen className="text-green-600 dark:text-green-400" size={28} />
  </div>
  <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
    الأقسام
  </h2>
  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
    إدارة تصنيفات متجرك
  </p>
</div>


      {/* Input Section */}
      <div className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center transition-all">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="اسم القسم الجديد..."
          className="w-full flex-1 p-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-green-500 dark:text-white outline-none shadow-sm hover:shadow-md transition-all"
        />
        <button
          onClick={handleAdd}
          className="w-full md:w-auto px-8 py-4 md:px-5 md:py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-transform transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm md:text-base shadow-md"
        >
          <Plus size={18} />
          إضافة
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {categories.map(cat => (
          <div
            key={cat._id}
            className="group flex justify-between items-center p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-lg hover:border-green-300 transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>

              {editingId === cat._id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="flex-1 p-2 bg-gray-100 dark:bg-gray-900 rounded-xl outline-none border border-green-300 dark:border-green-600"
                />
              ) : (
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                  {cat.name}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {editingId === cat._id ? (
                <>
                  <button
                    onClick={() => handleUpdate(cat._id)}
                    className="p-2.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg transition-all"
                  >
                    <X size={20} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(cat._id, cat.name)}
                    className="p-2.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
