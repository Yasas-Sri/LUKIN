import { cookies } from "next/headers";
import { PrintButton } from "@/components/PrintButton";
import { createClient } from "@/utils/supabase/server";

type OrderRow = {
  id: number;
  total: number;
  status: string;
  created_at: string;
  order_items: {
    quantity: number;
    unit_price: number;
    product: { title: string; category: { name: string } | null } | null;
  }[];
};

export default async function AdminDashboard() {
  const supabase = createClient(await cookies());

  const [{ data: ordersData }, { data: lowStock }, { count: productCount }] =
    await Promise.all([
      supabase
        .from("orders")
        .select(
          "id, total, status, created_at, order_items(quantity, unit_price, product:products(title, category:categories(name)))"
        )
        .order("created_at", { ascending: false }),
      supabase.from("products").select("id, title, stock").lte("stock", 10).order("stock"),
      supabase.from("products").select("*", { count: "exact", head: true }),
    ]);
  const orders = (ordersData ?? []) as unknown as OrderRow[];

  const revenue = orders.reduce((s, o) => s + Number(o.total), 0);
  const itemsSold = orders.flatMap((o) => o.order_items).reduce((s, i) => s + i.quantity, 0);

  // monthly sales summary
  const monthly = new Map<string, { orders: number; items: number; revenue: number }>();
  for (const o of orders) {
    const month = o.created_at.slice(0, 7);
    const m = monthly.get(month) ?? { orders: 0, items: 0, revenue: 0 };
    m.orders += 1;
    m.revenue += Number(o.total);
    m.items += o.order_items.reduce((s, i) => s + i.quantity, 0);
    monthly.set(month, m);
  }

  // sales by category
  const byCategory = new Map<string, { items: number; revenue: number }>();
  for (const item of orders.flatMap((o) => o.order_items)) {
    const cat = item.product?.category?.name ?? "Unknown";
    const c = byCategory.get(cat) ?? { items: 0, revenue: 0 };
    c.items += item.quantity;
    c.revenue += item.quantity * Number(item.unit_price);
    byCategory.set(cat, c);
  }

  // top-selling products
  const byProduct = new Map<string, { items: number; revenue: number }>();
  for (const item of orders.flatMap((o) => o.order_items)) {
    const title = item.product?.title ?? "Unknown";
    const p = byProduct.get(title) ?? { items: 0, revenue: 0 };
    p.items += item.quantity;
    p.revenue += item.quantity * Number(item.unit_price);
    byProduct.set(title, p);
  }
  const topProducts = [...byProduct.entries()]
    .sort((a, b) => b[1].items - a[1].items)
    .slice(0, 10);

  const money = (n: number) => `$${n.toFixed(2)}`;

  return (
    <div className="flex flex-col gap-10">
      {/* heading only the printed/PDF report shows */}
      <div className="hidden print:block">
        <h1 className="text-2xl font-bold uppercase tracking-widest">LUKIN — Sales Report</h1>
        <p className="text-sm text-gray-500">Generated {new Date().toLocaleString()}</p>
      </div>

      <div className="flex justify-end print:hidden">
        <PrintButton label="Generate Report (PDF)" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ["Total revenue", money(revenue)],
          ["Orders", orders.length],
          ["Items sold", itemsSold],
          ["Products in catalogue", productCount ?? 0],
        ].map(([label, value]) => (
          <div key={label} className="border rounded-2xl p-4">
            <p className="text-xs uppercase tracking-widest text-gray-500">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="font-bold uppercase tracking-widest mb-3">Monthly Sales Summary</h2>
        <table className="w-full text-sm border divide-y">
          <thead className="bg-neutral-100 text-left">
            <tr><th className="p-2">Month</th><th className="p-2">Orders</th><th className="p-2">Items sold</th><th className="p-2">Revenue</th></tr>
          </thead>
          <tbody className="divide-y">
            {[...monthly.entries()].sort().reverse().map(([month, m]) => (
              <tr key={month}>
                <td className="p-2">{month}</td>
                <td className="p-2">{m.orders}</td>
                <td className="p-2">{m.items}</td>
                <td className="p-2">{money(m.revenue)}</td>
              </tr>
            ))}
            {monthly.size === 0 && (
              <tr><td className="p-2 text-gray-500" colSpan={4}>No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="font-bold uppercase tracking-widest mb-3">Sales by Category</h2>
        <table className="w-full text-sm border divide-y">
          <thead className="bg-neutral-100 text-left">
            <tr><th className="p-2">Category</th><th className="p-2">Items sold</th><th className="p-2">Revenue</th></tr>
          </thead>
          <tbody className="divide-y">
            {[...byCategory.entries()].sort((a, b) => b[1].revenue - a[1].revenue).map(([cat, c]) => (
              <tr key={cat}>
                <td className="p-2">{cat}</td>
                <td className="p-2">{c.items}</td>
                <td className="p-2">{money(c.revenue)}</td>
              </tr>
            ))}
            {byCategory.size === 0 && (
              <tr><td className="p-2 text-gray-500" colSpan={3}>No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="font-bold uppercase tracking-widest mb-3">Top-Selling Products</h2>
        <table className="w-full text-sm border divide-y">
          <thead className="bg-neutral-100 text-left">
            <tr><th className="p-2">#</th><th className="p-2">Product</th><th className="p-2">Items sold</th><th className="p-2">Revenue</th></tr>
          </thead>
          <tbody className="divide-y">
            {topProducts.map(([title, p], i) => (
              <tr key={title}>
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{title}</td>
                <td className="p-2">{p.items}</td>
                <td className="p-2">{money(p.revenue)}</td>
              </tr>
            ))}
            {topProducts.length === 0 && (
              <tr><td className="p-2 text-gray-500" colSpan={4}>No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="font-bold uppercase tracking-widest mb-3">Low Stock (≤ 10 left)</h2>
        <table className="w-full text-sm border divide-y">
          <thead className="bg-neutral-100 text-left">
            <tr><th className="p-2">Product</th><th className="p-2">Stock</th></tr>
          </thead>
          <tbody className="divide-y">
            {(lowStock ?? []).map((p) => (
              <tr key={p.id}>
                <td className="p-2">{p.title}</td>
                <td className="p-2">{p.stock}</td>
              </tr>
            ))}
            {!lowStock?.length && (
              <tr><td className="p-2 text-gray-500" colSpan={2}>Nothing running low.</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
