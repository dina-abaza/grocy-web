"use client";

import { useEffect, useState } from "react";
import api from "@/app/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    weights: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // --- Fetch Categories ---
  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // --- Fetch Products ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/products");
    setProducts(res.data.products || res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // --- Add / Update Product ---
  const submitProduct = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      alert("الاسم، السعر، والفئة مطلوبة");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    for (const key in form) formData.append(key, form[key]);
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editProductId) {
        await api.put(`/api/products/${editProductId}`, formData, { withCredentials: true });
      } else {
        await api.post("/api/products", formData, { withCredentials: true });
      }
      setForm({ name: "", price: "", category: "", weights: "" });
      setImageFile(null);
      setEditProductId(null);
      fetchProducts();
    } catch (err) {
      console.error("Submit product error", err.response?.data || err.message);
      alert(err.response?.data?.message || "حدث خطأ");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Delete Product ---
  const deleteProduct = async (id) => {
    if (!confirm("هل أنت متأكد من حذف المنتج؟")) return;
    try {
      await api.delete(`/api/products/${id}`, { withCredentials: true });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete product error", err.response?.data || err.message);
    }
  };

  // --- Edit Product ---
  const editProduct = (product) => {
    setEditProductId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category?._id || "",
      weights: product.weights || "",
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        {editProductId ? "تعديل المنتج" : "إضافة منتج جديد"}
      </h2>

      {/* --- Form --- */}
      <form onSubmit={submitProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="اسم المنتج"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          type="number"
          placeholder="السعر"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <select
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        >
          <option value="">اختر الفئة</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <input
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="الأوزان (مثال: 100g,200g)"
          value={form.weights}
          onChange={(e) => setForm({ ...form, weights: e.target.value })}
        />
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
          صورة المنتج
          <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="col-span-full px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {editProductId ? "تعديل المنتج" : "إضافة المنتج"}
        </button>
      </form>

      {/* --- Products Table --- */}
      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">جاري التحميل...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الصورة</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الاسم</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">السعر</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الوزن</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 whitespace-nowrap">
                    {p.image && <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-md" />}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{p.name}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{p.price}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-500 dark:text-gray-300">{p.weights || "-"}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 mr-2"
                      onClick={() => editProduct(p)}
                    >
                      تعديل
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      onClick={() => deleteProduct(p._id)}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
