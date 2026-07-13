"use server";

import { cookies, headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

type CartInput = { id: number; qty: number }[];

// re-validate against the database: prices and stock at time of sale
async function validateCart(
  supabase: ReturnType<typeof createClient>,
  items: CartInput
) {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, title, price, stock, thumbnail")
    .in("id", items.map((i) => i.id));
  if (error) return { error: error.message };

  let total = 0;
  const lines = [];
  for (const item of items) {
    const product = products?.find((p) => p.id === item.id);
    if (!product) return { error: "A cart item no longer exists." };
    if (product.stock < item.qty)
      return { error: `Only ${product.stock} of "${product.title}" left in stock.` };
    total += product.price * item.qty;
    lines.push({
      product_id: product.id,
      title: product.title,
      thumbnail: product.thumbnail,
      quantity: item.qty,
      unit_price: product.price,
    });
  }
  return { total, lines };
}

export async function placeOrder(items: CartInput) {
  if (!items.length) return { error: "Cart is empty." };

  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "not_authenticated" };

  const cart = await validateCart(supabase, items);
  if ("error" in cart) return { error: cart.error };

  const { data: order, error: oErr } = await supabase
    .from("orders")
    .insert({ user_id: user.id, total: cart.total.toFixed(2) })
    .select("id")
    .single();
  if (oErr) return { error: oErr.message };

  const { error: iErr } = await supabase.from("order_items").insert(
    cart.lines.map((l) => ({
      order_id: order.id,
      product_id: l.product_id,
      quantity: l.quantity,
      unit_price: l.unit_price,
    }))
  );
  if (iErr) return { error: iErr.message };

  return { orderId: order.id };
}

// Stripe Checkout (test mode): card details are entered on Stripe's hosted
// page, never touch this app. The order is recorded on /checkout/success
// only after Stripe confirms payment.
export async function startCardCheckout(items: CartInput) {
  if (!items.length) return { error: "Cart is empty." };
  if (!process.env.STRIPE_SECRET_KEY)
    return { error: "Card payments are not configured (missing STRIPE_SECRET_KEY)." };

  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "not_authenticated" };

  const cart = await validateCart(supabase, items);
  if ("error" in cart) return { error: cart.error };

  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: cart.lines.map((l) => ({
        quantity: l.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(l.unit_price * 100),
          product_data: {
            name: l.title,
            // Stripe fetches these itself, so they must be public URLs — the
            // seed thumbnails (DummyJSON/FakeStore CDNs) are
            ...(l.thumbnail?.startsWith("https://") && { images: [l.thumbnail] }),
          },
        },
      })),
      // ponytail: validated cart rides in session metadata ([product_id, qty, unit_price]
      // tuples, 500-char cap ≈ 25 items); move to a pending order row if carts grow
      metadata: {
        cart: JSON.stringify(cart.lines.map((l) => [l.product_id, l.quantity, l.unit_price])),
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });
    return { url: session.url! };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Payment service unavailable." };
  }
}
