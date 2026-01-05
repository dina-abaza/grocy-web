"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PackageSearch,
  Tags,
  TrendingDown,
  Loader2,
  ArrowUpRight,
  Activity,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    offers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [p, c, o] = await Promise.all([
        axios.get("https://iraqi-e-store-api.vercel.app/api/products"),
        axios.get("https://iraqi-e-store-api.vercel.app/api/categories"),
        axios.get("https://iraqi-e-store-api.vercel.app/api/products/offers"),
      ]);

      setStats({
        products: p.data.totalProducts || 0,
        categories: c.data.length || 0,
        offers: o.data.totalProducts || 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-gray-800">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="المنتجات" value={stats.products} />
        <StatCard title="الأقسام" value={stats.categories} />
        <StatCard title="العروض" value={stats.offers} />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition">
      <p className="text-gray-400 font-bold">{title}</p>
      <h2 className="text-4xl font-black text-gray-800">{value}</h2>
    </div>
  );
}
