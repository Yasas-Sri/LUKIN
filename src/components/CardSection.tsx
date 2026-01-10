import { CustomCard } from "@/components/CustomCard";
import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function CardSection() {
  return (
    <main className="flex flex-col w-full gap-16 pb-20">
 
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between m-8">
          <h2 className="text-2xl font-bold uppercase tracking-widest">
            Shop by Category
          </h2>
      
        </div>

      
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <CustomCard
              key={cat.title}
              title={cat.title}
              imageSrc={cat.image}
              buttonText="Shop"
      
              containerStyles={cn(
                "h-[250px]  w-[120px] md:w-[200px] rounded-2xl transition-transform hover:scale-[1.02]", 
                cat.color
              )}
              contentStyles="items-start justify-end p-4 md:p-6"
              textStyles="text-xl md:text-2xl text-black font-semibold"
              buttonStyles="bg-black text-white text-[10px] px-4 py-2"
              imageStyles="object-contain"
            />
          ))}
        </div>
      </section>
    </main>
  );
}