/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartProvider";
import { placeOrder } from "./actions";

export default function CartPage() {
  const { items, setQty, remove, clear, subtotal, count } = useCart();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const router = useRouter();

  async function checkout() {
    setPlacing(true);
    setError(null);
    const result = await placeOrder(items.map((i) => ({ id: i.id, qty: i.qty })));
    if ("orderId" in result && result.orderId) {
      clear();
      setOrderId(result.orderId);
    } else if (result.error === "not_authenticated") {
      router.push("/login?next=/cart");
    } else {
      setError(result.error ?? "Something went wrong.");
    }
    setPlacing(false);
  }

  if (orderId) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-widest">
          Thank you! Order #{orderId} placed.
        </h1>
        <p className="text-gray-500">
          Payment is cash on delivery. You can review this order anytime on your profile.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/profile">View My Orders</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold uppercase tracking-widest">Your cart is empty</h1>
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 pt-40 pb-20">
      <h1 className="text-2xl font-bold uppercase tracking-widest mb-8">
        Shopping Cart ({count})
      </h1>

      <div className="flex flex-col divide-y">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-4">
            <Link href={`/product/${item.id}`} className="shrink-0">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-24 w-24 rounded-lg bg-gray-100 object-contain"
              />
            </Link>

            <div className="flex-1 min-w-0">
              <Link href={`/product/${item.id}`} className="font-semibold hover:underline line-clamp-2">
                {item.title}
              </Link>
              <p className="text-sm text-gray-500">${item.price} each</p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setQty(item.id, item.qty - 1)}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{item.qty}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setQty(item.id, item.qty + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <p className="w-20 text-right font-semibold">
              ${(item.price * item.qty).toFixed(2)}
            </p>

            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-black" onClick={() => remove(item.id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-2 border-t pt-6">
        <p className="text-lg">
          Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span>
        </p>
        <p className="text-xs text-gray-500">Free shipping on orders over $100. Cash on delivery.</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button size="lg" className="mt-2" onClick={checkout} disabled={placing}>
          {placing ? "Placing order..." : "Checkout"}
        </Button>
      </div>
    </div>
  );
}
