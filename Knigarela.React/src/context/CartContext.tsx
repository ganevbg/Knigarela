"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCart, addToCart, removeFromCart, clearCart } from "@/api/cart";
import { debug } from "console";

export type CartItem = {
  boxId: string;
  purchaseType: string;
  quantity: number;
  title: string;
  unitPrice: number;
  imageUrl: string;
};

type CartContextType = {
  items: CartItem[];
  totalCount: number;
  refresh: () => Promise<void>;
  add: (boxId: string, purchaseType: string, quantity?: number) => Promise<void>;
  remove: (boxId: string, purchaseType: string) => Promise<void>;
  clear: () => Promise<void>;
};

const CartCtx = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      const data = await getCart();
      setItems(data);
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  }

    async function add(boxId: string, purchaseType: string, quantity = 1) {
    await addToCart(boxId, quantity, purchaseType);
    await refresh();
  }

  async function remove(boxId: string, purchaseType: string) {
    await removeFromCart(boxId, purchaseType);
    await refresh();
  }

  async function clear() {
    await clearCart();
    setItems([]);
  }

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartCtx.Provider value={{ items, totalCount, refresh, add, remove, clear }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within <CartProvider />");
  return ctx;
}
