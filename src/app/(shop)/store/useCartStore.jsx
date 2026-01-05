import { create } from "zustand";
import api from "@/app/api";
import { toast } from "react-toastify";

export const useCartStore = create((set) => ({
  cart: null,
  loading: false,

  // جلب عربة التسوق للمستخدم
  fetchCart: async (userId) => {
    set({ loading: true });
    try {
        const res = await api.get(`/cart/${userId}`);
    console.log("🚀 cart API response:", res.data);
      set({ cart: res.data });
    } catch (err) {
      console.error("خطأ في جلب السلة:", err.response?.data || err.message);
      set({ cart: null });
      toast.error("فشل جلب السلة");
    } finally {
      set({ loading: false });
    }
  },

  // إضافة منتج للسلة
  addToCart: async (userId, productId, qty) => {
    try {
      const res = await api.post("/cart", {
        userId,
        productId,
        qty,
      });

      set({ cart: res.data });
      toast.success("تمت الإضافة للسلة!");
    } catch (err) {
      console.error(err.response?.data);
      toast.error("فشل الإضافة للسلة");
    }
  },

  // تحديث كمية المنتج
  updateQty: async (userId, productId, qty) => {
    try {
      const res = await api.put("/cart/item", { userId, productId, qty });
      set({ cart: res.data });
    } catch (err) {
      console.error(err.response?.data);
      toast.error("فشل تحديث الكمية");
    }
  },

  // إزالة منتج من السلة
  removeItem: async (userId, productId) => {
    try {
      const res = await api.delete("/cart/item", { data: { userId, productId } });
      set({ cart: res.data });
    } catch (err) {
      console.error(err.response?.data);
      toast.error("فشل إزالة المنتج");
    }
  }
}));
