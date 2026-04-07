import { CustomCard } from "@/components/CustomCard";
import CardSection from "@/components/CardSection";
import ProductSection from "@/components/ProductSection";

export default function Home() {
  return (
    <div className="flex  flex-col items-center justify-between pt-32 mt-8">
       <CustomCard 
  title="Luxury Winter Style"
  imageSrc="/images/home1.jpg"
  buttonText="Explore Now"
  containerStyles="
    w-full
    aspect-[5/4]          sm:aspect-[4/3]          md:aspect-[16/9]
    max-h-[85vh]          md:max-h-[90vh]
    rounded-none border-b
  "
  contentStyles="items-center justify-center text-center bg-black/10"
  textStyles="text-5xl md:text-7xl text-white"
  buttonStyles="rounded-md bg-white text-black px-10 py-8 hover:bg-neutral-200"
  imageStyles="object-cover object-top"
/>

 <CardSection/>

 <ProductSection/>

    </div>
  );
}
