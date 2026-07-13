import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { ProductForm } from "../ProductForm";
import type { Category } from "@/lib/types";

export default async function NewProduct() {
  const supabase = createClient(await cookies());
  const { data: categories } = await supabase.from("categories").select("*").order("name");

  return (
    <div>
      <h2 className="font-bold uppercase tracking-widest mb-6">New Product</h2>
      <ProductForm categories={(categories ?? []) as Category[]} />
    </div>
  );
}
