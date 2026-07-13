import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { Button } from "@/components/ui/button";
import { ClearCart } from "@/components/ClearCart";
import { createClient } from "@/utils/supabase/server";

export default async function CheckoutSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  if (!session_id) redirect("/cart");

  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/cart");

  // verify with Stripe directly (secret key, server-side) — the URL param alone proves nothing
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const session = await stripe.checkout.sessions.retrieve(session_id);
  if (session.payment_status !== "paid") redirect("/cart");

  // payment_ref is unique, so refreshing this page can't record the order twice
  let { data: order } = await supabase
    .from("orders")
    .select("id")
    .eq("payment_ref", session.id)
    .maybeSingle();

  if (!order) {
    const cart = JSON.parse(session.metadata!.cart) as [number, number, number][];
    const { data: created, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total: ((session.amount_total ?? 0) / 100).toFixed(2),
        status: "confirmed",
        payment_method: "card",
        payment_ref: session.id,
      })
      .select("id")
      .single();

    if (error) {
      if (error.code !== "23505") throw new Error(error.message);
      // a concurrent request won the race — reuse its order
      ({ data: order } = await supabase
        .from("orders")
        .select("id")
        .eq("payment_ref", session.id)
        .single());
    } else {
      const { error: iErr } = await supabase.from("order_items").insert(
        cart.map(([product_id, quantity, unit_price]) => ({
          order_id: created.id,
          product_id,
          quantity,
          unit_price,
        }))
      );
      if (iErr) throw new Error(iErr.message);
      order = created;
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <ClearCart />
      <h1 className="text-2xl font-bold uppercase tracking-widest">
        Payment successful — Order #{order?.id} confirmed.
      </h1>
      <p className="text-gray-500">
        Paid by card via Stripe. You can review this order anytime on your profile.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href={`/invoice/${order?.id}`}>View Invoice</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/profile">View My Orders</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
