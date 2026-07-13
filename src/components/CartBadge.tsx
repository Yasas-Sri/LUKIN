"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/CartProvider";

export function CartBadge() {
  const { count } = useCart();

  return (
    <Link href="/cart" className="relative hover:text-neutral-500 transition-colors">
      <ShoppingBag className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
