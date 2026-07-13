import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { updateOrderStatus } from "../actions";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

type OrderRow = {
  id: number;
  user_id: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  order_items: { quantity: number; unit_price: number; product: { title: string } | null }[];
};

export default async function AdminOrders() {
  const supabase = createClient(await cookies());
  const { data } = await supabase
    .from("orders")
    .select("id, user_id, total, status, payment_method, created_at, order_items(quantity, unit_price, product:products(title))")
    .order("created_at", { ascending: false });
  const orders = (data ?? []) as unknown as OrderRow[];

  return (
    <div>
      <h2 className="font-bold uppercase tracking-widest mb-4">
        Orders ({orders.length})
      </h2>

      {orders.length === 0 && <p className="text-gray-500">No orders yet.</p>}

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-2xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">
                  Order #{order.id} — ${order.total}{" "}
                  <span className="ml-1 align-middle text-xs uppercase tracking-widest rounded-full bg-neutral-100 px-3 py-1">
                    {order.payment_method === "card" ? "card · paid" : "cod"}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.created_at).toLocaleString()} · customer {order.user_id.slice(0, 8)}…
                </p>
              </div>
              <form action={updateOrderStatus} className="flex items-center gap-2">
                <Link
                  href={`/invoice/${order.id}`}
                  className="text-xs underline hover:text-neutral-500 mr-2"
                >
                  Invoice
                </Link>
                <input type="hidden" name="id" value={order.id} />
                <select
                  name="status"
                  defaultValue={order.status}
                  className="rounded-md border px-2 py-1 text-sm h-8"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <Button size="sm" variant="outline">Update</Button>
              </form>
            </div>
            <ul className="mt-2 text-sm text-gray-700">
              {order.order_items.map((item, i) => (
                <li key={i}>
                  {item.quantity} × {item.product?.title} — ${item.unit_price}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
