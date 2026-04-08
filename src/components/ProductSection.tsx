import { CustomCard } from "@/components/CustomCard";

// Define the type for the API product
export interface Product {
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

export default async function ProductSection() {
  // Fetch from the escuelajs api. Category 1 is clothes.
  // Using no-store to ensure it fetches fresh, or you can omit for caching.
  const res = await fetch("https://api.escuelajs.co/api/v1/products/?categoryId=1&limit=8");
  const products: Product[] = await res.json();

  return (
    <section className="container mx-auto px-4 mt-8 pb-20">
      <div className="flex items-center justify-between m-8">
        <h2 className="text-2xl font-bold uppercase tracking-widest">
          Latest Clothing
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => {
          // Some items in the fake API have malformed images (e.g. "[\"url\"]"). 
          // We can clean them up if needed, or just use the first raw string.
          let imageUrl = product.images[0];
          if (imageUrl?.startsWith('["')) {
            try {
               imageUrl = JSON.parse(product.images[0])[0];
            } catch {
               // ignore
            }
          }

          return (
            <CustomCard
              key={product.id}
              title={product.title}
              href={`/product/${product.id}`}
              imageSrc={imageUrl || "https://auto.escuelajs.co/api/v1/products/1"} // fallback
              buttonText={`$${product.price} - Buy`}
              containerStyles="h-[350px] w-full rounded-2xl transition-transform hover:scale-[1.02] bg-[#f9f9f9]"
              contentStyles="items-start justify-end p-4 md:p-6"
              textStyles="text-lg md:text-xl text-black font-semibold truncate w-full"
              buttonStyles="bg-black text-white text-xs px-4 py-2 mt-2"
              imageStyles="object-cover rounded-t-2xl"
            />
          );
        })}
      </div>
    </section>
  );
}
