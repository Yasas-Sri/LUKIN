"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function placeOrder(items: { id: number; qty: number }[]) {
  if (!items.length) return { error: "Cart is empty." };

  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "not_authenticated" };

  // re-validate against the database: prices and stock at time of sale
  const { data: products, error: pErr } = await supabase
    .from("products")
    .select("id, title, price, stock")
    .in("id", items.map((i) => i.id));
  if (pErr) return { error: pErr.message };

  let total = 0;
  const lines = [];
  for (const item of items) {
    const product = products?.find((p) => p.id === item.id);
    if (!product) return { error: "A cart item no longer exists." };
    if (product.stock < item.qty)
      return { error: `Only ${product.stock} of "${product.title}" left in stock.` };
    total += product.price * item.qty;
    lines.push({ product_id: product.id, quantity: item.qty, unit_price: product.price });
  }

  const { data: order, error: oErr } = await supabase
    .from("orders")
    .insert({ user_id: user.id, total: total.toFixed(2) })
    .select("id")
    .single();
  if (oErr) return { error: oErr.message };

  const { error: iErr } = await supabase
    .from("order_items")
    .insert(lines.map((l) => ({ ...l, order_id: order.id })));
  if (iErr) return { error: iErr.message };

  return { orderId: order.id };
}
