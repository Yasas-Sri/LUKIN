import { CustomCard } from "@/components/CustomCard";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24 mt-8">
       <CustomCard 
        height="h-[550px]"
        imagePosition="full"
        textAlign="center"
        isDarkText={false}
        title="Summer Arrival of Outfit"
        imageSrc=""
        buttonText="Explore Product"
      />
    </div>
  );
}
