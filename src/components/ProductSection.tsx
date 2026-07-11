import { cookies } from "next/headers";
import { CustomCard } from "@/components/CustomCard";
import { createClient } from "@/utils/supabase/server";
import type { Product } from "@/lib/types";

export default async function ProductSection() {
  const supabase = createClient(await cookies());
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false })
    .limit(8);
  const products = (data ?? []) as Product[];

  return (
    <section className="container mx-auto px-4 mt-8 pb-20">
      <div className="flex items-center justify-between m-8">
        <h2 className="text-2xl font-bold uppercase tracking-widest">
          Latest Clothing
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <CustomCard
            key={product.id}
            title={product.title}
            href={`/product/${product.id}`}
            imageSrc={product.thumbnail}
            buttonText={`$${product.price} - Buy`}
            containerStyles="h-[350px] w-full rounded-2xl transition-transform hover:scale-[1.02] bg-[#f9f9f9]"
            contentStyles="items-start justify-end p-4 md:p-6"
            textStyles="text-lg md:text-xl text-black font-semibold truncate w-full"
            buttonStyles="bg-black text-white text-xs px-4 py-2 mt-2"
            imageStyles="object-contain rounded-t-2xl"
          />
        ))}
      </div>
    </section>
  );
}
