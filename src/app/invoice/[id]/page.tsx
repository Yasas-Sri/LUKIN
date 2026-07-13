import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/PrintButton";
import { createClient } from "@/utils/supabase/server";

// RLS scopes this page for free: customers can only load their own orders,
// admins can load any.
export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient(await cookies());

  const { data } = await supabase
    .from("orders")
    .select(
      "id, user_id, total, status, payment_method, created_at, order_items(quantity, unit_price, product:products(title))"
    )
    .eq("id", Number(id))
    .maybeSingle();
  const order = data as unknown as {
    id: number;
    user_id: string;
    total: number;
    status: string;
    payment_method: string;
    created_at: string;
    order_items: { quantity: number; unit_price: number; product: { title: string } | null }[];
  } | null;
  if (!order) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", order.user_id)
    .maybeSingle();

  const paid = order.payment_method === "card";

  return (
    <div className="container mx-auto max-w-2xl px-4 pt-40 pb-20 print:pt-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest">LUKIN</h1>
          <p className="text-sm text-gray-500">Clothing Store</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold uppercase tracking-widest">Invoice</h2>
          <p className="text-sm text-gray-500">#{order.id}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-between text-sm">
        <div>
          <p className="text-gray-500 uppercase text-xs tracking-widest">Billed to</p>
          <p className="font-medium">{profile?.email ?? "Customer"}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 uppercase text-xs tracking-widest">Payment</p>
          <p className="font-medium">
            {paid ? "Card (Stripe) — PAID" : "Cash on delivery — payable on delivery"}
          </p>
        </div>
      </div>

      <table className="mt-8 w-full text-sm border divide-y">
        <thead className="bg-neutral-100 text-left">
          <tr>
            <th className="p-2">Item</th>
            <th className="p-2 text-right">Qty</th>
            <th className="p-2 text-right">Unit price</th>
            <th className="p-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {order.order_items.map((item, i) => (
            <tr key={i}>
              <td className="p-2">{item.product?.title ?? "Item"}</td>
              <td className="p-2 text-right">{item.quantity}</td>
              <td className="p-2 text-right">${Number(item.unit_price).toFixed(2)}</td>
              <td className="p-2 text-right">
                ${(item.quantity * Number(item.unit_price)).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t font-bold">
            <td className="p-2" colSpan={3}>Total</td>
            <td className="p-2 text-right">${Number(order.total).toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <p className="mt-6 text-xs text-gray-500">
        Thank you for shopping with LUKIN. This invoice was generated electronically
        and is valid without a signature.
      </p>

      <div className="mt-8 flex gap-3 print:hidden">
        <PrintButton label="Print / Save as PDF" />
        <Button asChild variant="outline">
          <Link href="/profile">Back to My Orders</Link>
        </Button>
      </div>
    </div>
  );
}
