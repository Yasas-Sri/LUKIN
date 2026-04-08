/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";

// Optional: define the shape of the expected Product
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: {
    id: number;
    name: string;
    image: string;
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Fetch product data from the fake API
  const res = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`);
  
  if (!res.ok) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  const product: Product = await res.json();

  // Clean up image URLs if they are malformed as a serialized array inside the string
  const cleanImages = product.images.map((img) => {
    if (img?.startsWith('["')) {
      try {
        return JSON.parse(img)[0];
      } catch {
        return img;
      }
    }
    return img;
  });

  const mainImage = cleanImages[0] || "https://placehold.co/600x600";

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
          {cleanImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {cleanImages.map((img, index) => (
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
          </div>

          <div className="prose text-gray-700">
            <p className="leading-relaxed">{product.description}</p>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col gap-4">
             {/* If we had sizes or colors, they would go here */}
            <Button size="lg" className="w-full md:w-auto text-lg h-14">
              Add to Cart
            </Button>
            <p className="text-xs text-center md:text-left text-gray-500 mt-2">
              Free shipping on orders over $100.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
