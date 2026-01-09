import { CustomCard } from "@/components/CustomCard";
import CardSection from "@/components/CardSection";

export default function Home() {
  return (
    <div className="flex  flex-col items-center justify-between pt-32 mt-8">
       <CustomCard 
  title="Luxury Winter Style"
  imageSrc=""
  buttonText="Explore Now"
  containerStyles="w-full h-[70vh] rounded-none border-b"
  contentStyles="items-center justify-center text-center bg-black/10"
  textStyles="text-5xl md:text-7xl text-white"
  buttonStyles="rounded-md bg-white text-black px-10 py-8 hover:bg-neutral-200"
/>

 <CardSection/>

    </div>
  );
}
