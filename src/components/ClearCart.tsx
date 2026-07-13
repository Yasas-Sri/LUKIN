"use client";

import { useEffect } from "react";
import { useCart } from "./CartProvider";

// Empties the cart after a successful card payment. Waits for localStorage
// hydration, otherwise the provider's load effect would resurrect the items.
export function ClearCart() {
  const { loaded, clear } = useCart();
  useEffect(() => {
    if (loaded) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);
  return null;
}
