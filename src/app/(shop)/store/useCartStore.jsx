import { create } from "zustand";
import api from "@/app/api";
import { toast } from "react-toastify";

export const useCartStore = create((set) => ({
  cart: null,
  loading: false,

  fetchCart: async (userId) => {
    if (!userId) return;
    try {
      set({ loading: true });
      const res = await api.get(`/cart/${userId}`);
      set({ cart: res.data, loading: false });
    } catch (err) {
      set({ loading: false });
      console.error("خطأ السلة:", err);
    }
  },

  addToCart: async (userId, productId, qty) => {
    console.log("البيانات المرسلة للباك إند:", { userId, productId, qty });
    try {
      const res = await api.post("/cart", { userId, productId, qty });
      set({ cart: res.data });
      toast.success("تمت الإضافة للسلة!");
    } catch (err) {
      toast.error("فشل الإضافة");
    }
  },

  updateQty: async (userId, productId, qty) => {
    try {
      const res = await api.put("/cart/item", { userId, productId, qty });
      set({ cart: res.data });
    } catch (err) {
      toast.error("فشل تحديث الكمية");
    }
  },

  removeItem: async (userId, productId) => {
    try {
      const res = await api.delete("/cart/item", { data: { userId, productId } });
      set({ cart: res.data });
      toast.success("تم الحذف");
    } catch (err) {
      toast.error("فشل الحذف");
    }
  },
}));