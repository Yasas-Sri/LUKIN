"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  loaded: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

// ponytail: guest cart in localStorage; sync to a Supabase cart_items table when auth lands
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // load after mount to avoid SSR hydration mismatch
  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem("cart") ?? "[]"));
    } catch {
      // corrupted storage — start fresh
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("cart", JSON.stringify(items));
  }, [items, loaded]);

  const add = (item: Omit<CartItem, "qty">) =>
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });

  const setQty = (id: number, qty: number) =>
    setItems((prev) =>
      qty < 1
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );

  const remove = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, count, subtotal, loaded }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
