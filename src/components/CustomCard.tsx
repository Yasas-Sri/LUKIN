import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomCardProps {
  title: string
  subtitle?: string
  imageSrc: string
  buttonText: string
  containerStyles?: string 
  contentStyles?: string   
  textStyles?: string      
  buttonStyles?: string    
}

export function CustomCard({ 
  title, 
  subtitle, 
  imageSrc, 
  buttonText, 
  containerStyles = "h-[400px] w-full rounded-xl", 
  contentStyles = "items-start justify-end",
  textStyles = "text-white text-3xl",
  buttonStyles = "bg-white text-black"
}: CustomCardProps) {
  return (
    <div className={cn("relative overflow-hidden group", containerStyles)}>
      
      <Image 
        src={imageSrc} 
        alt={title} 
        fill
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
      
   
      <div className={cn("absolute inset-0 flex flex-col p-8 z-10", contentStyles)}>
        <div className="space-y-2">
          <h2 className={cn("font-bold tracking-tight uppercase leading-tight", textStyles)}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-white/80 text-sm md:text-base font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div className="pt-4">
          <Button className={cn("font-bold uppercase", buttonStyles)}>
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
}