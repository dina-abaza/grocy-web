"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/api"; 
import { ShoppingCart, ArrowRight, Plus, Minus} from "lucide-react";
import { toast } from "react-toastify";
import Activity from "@/app/loading";

// ✅ Stores
import { useAuthStore } from "@/app/(shop)/store/useAuthStore";
import { useCartStore } from "@/app/(shop)/store/useCartStore";

const CategoryProducts = () => {
  const { id } = useParams();
  const router = useRouter();

  const { user, isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/category/${id}`, { params: { page, limit } });
        const realProducts = response.data.products || [];

        setProducts(realProducts);
        setCategoryName(response.data.name || "المنتجات");
        const tp =
          response.data?.totalPages ??
          response.data?.pages ??
          (response.data?.total ? Math.ceil(response.data.total / limit) : null);
        setTotalPages(tp);

        const initialQuantities = {};
        realProducts.forEach((p) => (initialQuantities[p._id] = 1));
        setQuantities(initialQuantities);

      } catch (error) {
        setProducts([]);
        setCategoryName("المنتجات");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategoryData();
  }, [id, page]);

  const increment = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const decrement = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1),
    }));
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast.info("سجّل الدخول أولاً 🧾");
      router.push("/login");
      return;
    }

    const qty = quantities[product._id] || 1;
    const userId = user?.id || user?._id;

    try {
      await addToCart(userId, product._id, qty);
    } catch (error) {
       console.error("Cart Add Error:", error);
    }
  };

  if (loading)
    return (
     <Activity/>
    );

  return (
    <div className="bg-[#f8f8f8] min-h-screen pb-24" dir="rtl">
      <div className="bg-white/90 backdrop-blur-md sticky top-0 p-4 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-center relative">
          <button
            onClick={() => router.back()}
            className="text-red-600 absolute right-0 hover:bg-red-50 p-1 rounded-full"
          >
            <ArrowRight size={28} strokeWidth={2.5} />
          </button>
          <h1 className="text-red-600 font-extrabold text-xl md:text-2xl">
            {categoryName}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={`px-4 py-2 rounded-xl font-bold ${page <= 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            >
              السابق
            </button>
            <span className="font-bold text-sm text-gray-700">
              الصفحة {page}{totalPages ? ` من ${totalPages}` : ""}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={totalPages ? page >= totalPages : products.length < limit}
              className={`px-4 py-2 rounded-xl font-bold ${totalPages ? (page >= totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700") : (products.length < limit ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700")}`}
            >
              التالي
            </button>
          </div>
          <div className="text-xs text-gray-500">
            عدد العناصر في الصفحة: {limit}
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-wrap justify-center gap-4 max-w-7xl mx-auto">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-3xl p-3 shadow-sm flex flex-col items-center relative border border-gray-100 w-[calc(50%-8px)] md:w-[220px]"
            >
              <div className="absolute top-3 left-3 bg-gray-100 text-[10px] px-2 py-0.5 rounded-full">
                {product.weight || "N/A"}
              </div>

              <div 
                className="w-full h-36 flex items-center justify-center mb-3 cursor-pointer"
                onClick={() => router.push(`/product/${product._id}`)}
              > 
                <img 
                  src={product.image || "/placeholder.jpg"} 
                  alt={product.name} 
                  className="max-h-full object-contain" 
                />
              </div>

              <h3 className="font-bold text-[13px] text-center mb-1 line-clamp-2 h-8">
                {product.name}
              </h3>

              <div className="text-center mb-4 font-black">
                {product.price?.toLocaleString()} د.ع
              </div>

              <div className="flex items-center justify-between w-full bg-gray-50 p-1 rounded-full">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90"
                >
                  <ShoppingCart size={15} />
                </button>

                <div className="flex items-center gap-1">
                  <button onClick={() => decrement(product._id)} className="text-red-600 p-1">
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">
                    {quantities[product._id] || 1}
                  </span>
                  <button onClick={() => increment(product._id)} className="text-green-600 p-1">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-500 font-bold w-full">
            لا توجد منتجات في هذا القسم حالياً.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
