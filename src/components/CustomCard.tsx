import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomCardProps {
  title: string
  description?: string
  imageSrc: string
  buttonText: string
  // New Styling Props
  height?: string       // e.g., "h-[500px]" or "h-[300px]"
  textAlign?: "center" | "left"
  imagePosition?: "full" | "right" | "left"
  bgColor?: string
  isDarkText?: boolean
}

export function CustomCard({ 
  title, 
  description, 
  imageSrc, 
  buttonText,
  height = "h-[300px]", 
  textAlign = "left",
  imagePosition = "right",
  bgColor = "bg-white",
  isDarkText = true
}: CustomCardProps) {
  
  return (
    <div className={cn(
      "relative overflow-hidden rounded-[2rem] shadow-sm flex flex-col",
      height,
      bgColor,
      textAlign === "center" ? "items-center text-center justify-center" : "items-start justify-between",
    )}>
      {/* Background Image Logic */}
      <div className={cn(
        "absolute overflow-hidden",
        imagePosition === "full" ? "inset-0 w-full h-full" : 
        imagePosition === "right" ? "right-0 bottom-0 w-1/2 h-full" : 
        "left-0 bottom-0 w-1/2 h-full"
      )}>
        <Image 
          src={imageSrc} 
          alt={title} 
          fill
          className="object-cover object-center"
        />
        {imagePosition === "full" && <div className="absolute inset-0 bg-black/10" />}
      </div>

      {/* Content Layer */}
      <div className={cn(
        "relative z-10 flex h-full flex-col p-8 md:p-12",
        textAlign === "center" ? "justify-center items-center gap-4" : "justify-between"
      )}>
        <div className={imagePosition === "full" ? "max-w-2xl" : "max-w-[240px]"}>
          <h2 className={cn(
            "font-medium leading-tight tracking-tight",
            imagePosition === "full" ? "text-5xl md:text-6xl" : "text-3xl",
            isDarkText ? "text-neutral-900" : "text-white"
          )}>
            {title}
          </h2>
          {description && (
            <p className={cn("mt-4", isDarkText ? "text-neutral-600" : "text-white/90")}>
              {description}
            </p>
          )}
        </div>

        <Button className={cn(
          "rounded-full px-8 py-6 shadow-lg",
          imagePosition === "full" ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-white text-black"
        )}>
          {buttonText}
        </Button>
      </div>
    </div>
  )
}