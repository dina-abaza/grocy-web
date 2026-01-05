"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/app/api";
export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!keyword) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/products/search", {
          params: { keyword, page: 1, limit: 10 },
        });
        console.log("SEARCH RESPONSE:", res.data);

       setProducts(res.data.products || []);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword]);

  if (loading) {
    return <p className="text-center mt-10">جاري البحث...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8">
      <h1 className="text-xl font-bold mb-6">
        نتائج البحث عن: <span className="text-red-600">{keyword}</span>
      </h1>

      {products.length === 0 ? (
        <p>لا توجد نتائج</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product._id}`}
              className="border rounded-xl p-3 hover:shadow"
            >
              <img
                src={product.image}
                className="w-full h-40 object-contain"
              />
              <h3 className="mt-2 text-sm font-bold">{product.name}</h3>
              <p className="text-red-600 font-bold">{product.price} جنيه</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
