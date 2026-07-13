import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { deleteProduct } from "../actions";

export default async function AdminProducts() {
  const supabase = createClient(await cookies());
  const { data: products } = await supabase
    .from("products")
    .select("id, title, price, stock, category:categories(name)")
    .order("id", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold uppercase tracking-widest">
          Products ({products?.length ?? 0})
        </h2>
        <Button asChild size="sm">
          <Link href="/admin/products/new">+ New Product</Link>
        </Button>
      </div>

      <table className="w-full text-sm border divide-y">
        <thead className="bg-neutral-100 text-left">
          <tr>
            <th className="p-2">ID</th><th className="p-2">Title</th>
            <th className="p-2">Category</th><th className="p-2">Price</th>
            <th className="p-2">Stock</th><th className="p-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {(products ?? []).map((p) => (
            <tr key={p.id}>
              <td className="p-2">{p.id}</td>
              <td className="p-2">
                <Link href={`/admin/products/${p.id}`} className="font-medium hover:underline">
                  {p.title}
                </Link>
              </td>
              <td className="p-2">{(p.category as unknown as { name: string } | null)?.name}</td>
              <td className="p-2">${p.price}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2 text-right">
                <form action={deleteProduct} className="inline">
                  <input type="hidden" name="id" value={p.id} />
                  <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
