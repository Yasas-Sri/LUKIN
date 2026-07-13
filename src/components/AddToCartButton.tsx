"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem } from "@/components/CartProvider";

export function AddToCartButton({
  product,
  outOfStock,
}: {
  product: Omit<CartItem, "qty">;
  outOfStock?: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <Button
      size="lg"
      className="w-full md:w-auto text-lg h-14"
      disabled={outOfStock}
      onClick={() => {
        add(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
    >
      {outOfStock ? "Out of Stock" : added ? "Added ✓" : "Add to Cart"}
    </Button>
  );
}
