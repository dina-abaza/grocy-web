"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://iraqi-e-store-api.vercel.app/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async () => {
    if (!newName) return;
    try {
      await axios.post("https://iraqi-e-store-api.vercel.app/api/categories", { name: newName }, { withCredentials: true });
      setNewName("");
      fetchCategories();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://iraqi-e-store-api.vercel.app/api/categories/${id}`, { withCredentials: true });
      fetchCategories();
    } catch (err) { console.error(err); }
  };

  if (loading) return <p className="text-center text-gray-500 dark:text-gray-400">جارٍ تحميل الأقسام...</p>;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">الأقسام</h2>
      <div className="flex gap-4">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="اسم القسم الجديد"
          className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={handleAdd}
          className="px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          إضافة قسم
        </button>
      </div>

      <ul className="space-y-3">
        {categories.map(cat => (
          <li key={cat._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm">
            <span className="text-gray-700 dark:text-gray-200">{cat.name}</span>
            <button
              onClick={() => handleDelete(cat._id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
