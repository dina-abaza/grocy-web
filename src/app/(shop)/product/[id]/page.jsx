"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/api";
import { toast } from "react-toastify";
import Activity from "@/app/loading";

const ProductDetails = () => {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Activity />;
  if (!product) return null;

  const hasDiscount = product.discountActive && product.discountPrice < product.price;

  return (
    <div className="bg-white min-h-screen pb-24" dir="rtl">
      {/* Header */}
  

      <div className="max-w-2xl mx-auto px-6 mt-6 flex flex-col items-center text-center">
        {/* صورة المنتج */}
        <img
          src={product.image}
          alt={product.name}
          className="max-h-64 object-contain mb-4"
        />

        {/* اسم المنتج */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h2>

        {/* السعر */}
        <div className="flex items-center gap-2 mb-2">
          {hasDiscount && (
            <span className="text-gray-400 text-lg line-through">
            {product.price?.toLocaleString()} د.ع 
            </span>
          )}
          <span className={`font-black ${hasDiscount ? "text-red-600 text-2xl" : "text-gray-900 text-2xl"}`}>
            {hasDiscount ? product.discountPrice?.toLocaleString() : product.price?.toLocaleString()} د.ع
          </span>
        </div>

        {/* الوزن */}
        {product.weight && (
          <div className="text-gray-500 mb-4">
            الوزن: {product.weight}
          </div>
        )}

        {/* الوصف */}
        <div className="border-t border-gray-100 pt-4 w-full text-right">
          <h3 className="font-bold text-gray-800 mb-2">الوصف</h3>
          <p className="text-gray-600 leading-relaxed text-sm">
            {product.description || "وصف المنتج غير متوفر حالياً."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;