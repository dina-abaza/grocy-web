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

  if (loading) return <p>جارٍ تحميل الأقسام...</p>;

  return (
    <div>
      <h2>الأقسام</h2>
      <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="اسم القسم الجديد" />
      <button onClick={handleAdd}>إضافة قسم</button>

      <ul>
        {categories.map(cat => (
          <li key={cat._id}>
            {cat.name} <button onClick={() => handleDelete(cat._id)}>حذف</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
