import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/SignOutButton";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/lib/admin";

export default async function ProfilePage() {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const admin = await isAdmin(supabase, user.id);
  const { data } = await supabase
    .from("orders")
    .select("id, total, status, created_at, order_items(quantity, unit_price, product:products(title))")
    .eq("user_id", user.id) // RLS alone isn't enough here: admins can read ALL orders
    .order("created_at", { ascending: false });
  const orders = data as
    | {
        id: number;
        total: number;
        status: string;
        created_at: string;
        order_items: { quantity: number; unit_price: number; product: { title: string } | null }[];
      }[]
    | null;

  return (
    <div className="container mx-auto max-w-2xl px-4 pt-40 pb-20">
      <h1 className="text-2xl font-bold uppercase tracking-widest mb-8">
        My Account
      </h1>

      <div className="flex flex-col gap-2 border rounded-2xl p-6">
        <p className="text-sm text-gray-500">Signed in as</p>
        <p className="font-semibold">{user.email}</p>
        <p className="text-sm text-gray-500">
          Member since {new Date(user.created_at).toLocaleDateString()}
        </p>
        <div className="mt-4 flex gap-3">
          <SignOutButton />
          {admin && (
            <Button asChild>
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8 border rounded-2xl p-6">
        <h2 className="font-bold uppercase tracking-widest mb-4">My Orders</h2>
        {!orders?.length ? (
          <p className="text-sm text-gray-500">No orders yet.</p>
        ) : (
          <div className="flex flex-col divide-y">
            {orders.map((order) => (
              <div key={order.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Order #{order.id}</p>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/invoice/${order.id}`}
                      className="text-xs underline hover:text-neutral-500"
                    >
                      Invoice
                    </Link>
                    <span className="text-xs uppercase tracking-widest rounded-full bg-neutral-100 px-3 py-1">
                      {order.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
                <ul className="mt-2 text-sm text-gray-700">
                  {order.order_items.map((item, i) => (
                    <li key={i}>
                      {item.quantity} × {item.product?.title} — ${item.unit_price}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 font-semibold">Total: ${order.total}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
