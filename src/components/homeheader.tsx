import Link from "next/link"; 
import { SearchBar } from "./Searchbar";
import { User, ShoppingBag } from "lucide-react"; 

export function HomeHeader() {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:grid md:grid-cols-3">
        
    
        <div className="flex justify-start">
          <SearchBar />
        </div>

        <div className="flex justify-center">
          <Link href="/" className="text-2xl font-bold tracking-tighter uppercase">
            Brand
          </Link>
        </div>

       
        <div className="flex items-center justify-end gap-6">
          <Link href="/profile" className="hover:text-neutral-500 transition-colors">
            <User className="h-6 w-6" />
          </Link>
          <Link href="/cart" className="relative hover:text-neutral-500 transition-colors">
            <ShoppingBag className="h-6 w-6" />
           
            <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
              0
            </span>
          </Link>
        </div>

      </div>
    </header>
  );
}