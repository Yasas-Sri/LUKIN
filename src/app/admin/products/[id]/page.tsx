import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { ProductForm } from "../ProductForm";
import type { Category, Product } from "@/lib/types";

export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient(await cookies());
  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("categories").select("*").order("name"),
  ]);

  if (!product) {
    return <p className="text-gray-500">Product not found.</p>;
  }

  return (
    <div>
      <h2 className="font-bold uppercase tracking-widest mb-6">
        Edit Product #{product.id}
      </h2>
      <ProductForm product={product as Product} categories={(categories ?? []) as Category[]} />
    </div>
  );
}
