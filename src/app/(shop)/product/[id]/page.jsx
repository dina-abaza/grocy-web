"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/api";
import { ShoppingCart, ArrowRight, Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";
import { useAuthStore } from "@/app/(shop)/store/useAuthStore";
import { useCartStore } from "@/app/(shop)/store/useCartStore";

const ProductDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  console.log("current user:", user);
  const { addToCart } = useCartStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // جلب بيانات المنتج من الباك اند
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data); 
      } catch (error) {
        toast.error("المنتج غير موجود");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProductData();
  }, [id]);

  
const handleAddToCart = async () => {
  if (!isAuthenticated) {
    toast.info("سجّل الدخول أولاً");
    router.push("/login");
    return;
  }

  const userId = user?.id || user?._id;

  if (!userId) {
    toast.error("userId غير موجود");
    return;
  }

  await addToCart(userId, product._id, quantity);
};

  if (loading)
    return <div className="text-center py-20 font-bold text-gray-400">جاري التحميل...</div>;
  if (!product) return null;

  return (
    <div className="bg-white min-h-screen pb-24" dir="rtl">
      {/* Header */}
      <div className="bg-white sticky top-0 z-50 p-4 flex items-center shadow-sm">
        <button onClick={() => router.back()} className="text-red-600 p-1">
          <ArrowRight size={28} strokeWidth={2.5} />
        </button>
        <h1 className="text-gray-800 font-bold text-lg mr-4">تفاصيل المنتج</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6">
        {/* صورة المنتج */}
        <div className="w-full py-6 flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name} 
            className="max-h-64 object-contain"
          />
        </div>

        {/* معلومات المنتج */}
        <div className="mt-4">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-red-600 font-black text-2xl">
              {product.price?.toLocaleString()} <span className="text-xs font-bold">د.ع</span>
            </span>
            <span className="text-gray-400 text-sm font-medium">/ {product.weight}</span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-4">{product.name}</h2>

          {/* اختيار الكمية */}
          <div className="flex items-center gap-4 bg-gray-50 w-fit px-4 py-2 rounded-2xl mb-6">
            <button onClick={() => setQuantity(q => q + 1)} className="text-green-600">
              <Plus size={18} strokeWidth={3} />
            </button>
            <span className="text-lg font-black w-4 text-center">{quantity}</span>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-red-600">
              <Minus size={18} strokeWidth={3} />
            </button>
          </div>

          {/* الوصف */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="font-bold text-gray-800 mb-2">الوصف</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description || "وصف المنتج غير متوفر حالياً."}
            </p>
          </div>
        </div>
      </div>

      {/* زر الإضافة للسلة */}
      {isAuthenticated && (
        <div className="fixed bottom-6 left-6 right-6 flex justify-end pointer-events-none">
          <button
            onClick={handleAddToCart}
            className="pointer-events-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-red-200 active:scale-95 transition-all"
          >
            <ShoppingCart size={20} />
            إضافة للسلة
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
