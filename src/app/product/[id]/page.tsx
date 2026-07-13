/* eslint-disable @next/next/no-img-element */
import { cookies } from "next/headers";
import { AddToCartButton } from "@/components/AddToCartButton";
import { createClient } from "@/utils/supabase/server";
import type { Product } from "@/lib/types";

type ProductWithCategory = Product & {
  category: { name: string; slug: string } | null;
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient(await cookies());

  const { data } = await supabase
    .from("products")
    .select("*, category:categories(name, slug)")
    .eq("id", id)
    .single();

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  const product = data as ProductWithCategory;
  const images = product.images.length ? product.images : [product.thumbnail];
  const mainImage = images[0];

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column - Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={mainImage}
              alt={product.title}
              className="object-cover w-full h-full"
            />
          </div>
          {/* Thumbnail Gallery (if more than 1 image) */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-square w-24 shrink-0 cursor-pointer overflow-hidden rounded-lg bg-gray-100 border-2 border-transparent hover:border-black transition-colors"
                >
                  <img
                    src={img}
                    alt={`${product.title} - view ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Info */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
              {product.category?.name || "Category"}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              {product.title}
            </h1>
            <p className="text-2xl font-semibold mt-4">
              ${product.price}
            </p>
            {product.stock > 0 ? (
              <p className="text-sm text-green-600">In stock ({product.stock} available)</p>
            ) : (
              <p className="text-sm text-red-600">Out of stock</p>
            )}
          </div>

          <div className="prose text-gray-700">
            <p className="leading-relaxed">{product.description}</p>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col gap-4">
            <AddToCartButton
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
              }}
              outOfStock={product.stock < 1}
            />
            <p className="text-xs text-center md:text-left text-gray-500 mt-2">
              Free shipping on orders over $100.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
