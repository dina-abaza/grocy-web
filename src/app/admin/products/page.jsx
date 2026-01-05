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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{editProductId ? "تعديل المنتج" : "إضافة منتج جديد"}</h2>

      {/* --- Form --- */}
      <form onSubmit={submitProduct} className="flex flex-col gap-3 bg-white p-4 rounded shadow-md mb-6">
        <input
          placeholder="اسم المنتج"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="السعر"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <select
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
          placeholder="الأوزان (مثال: 100g,200g)"
          value={form.weights}
          onChange={(e) => setForm({ ...form, weights: e.target.value })}
        />
        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {editProductId ? "تعديل المنتج" : "إضافة المنتج"}
        </button>
      </form>

      {/* --- Products Table --- */}
      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <table className="w-full text-right border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">الصورة</th>
              <th className="border p-2">الاسم</th>
              <th className="border p-2">السعر</th>
              <th className="border p-2">الوزن</th>
              <th className="border p-2">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="border p-2">
                  {p.image && <img src={p.image} className="w-16 h-16 object-cover rounded" />}
                </td>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.price}</td>
                <td className="border p-2">{p.weights || "-"}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded"
                    onClick={() => editProduct(p)}
                  >
                    تعديل
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => deleteProduct(p._id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
