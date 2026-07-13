import Link from "next/link";
import { SearchBar } from "./Searchbar";
import { User } from "lucide-react";
import { CartBadge } from "./CartBadge";

export function HomeHeader() {
  return (
    <header className="">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:grid md:grid-cols-3">
        
    
        <div className="flex justify-start">
          <SearchBar />
        </div>

        <div className="flex justify-center">
          <Link href="/" className="text-2xl font-bold tracking-tighter uppercase">
            LUKIN
          </Link>
        </div>

       
        <div className="flex items-center justify-end gap-6">
          <Link href="/profile" className="hover:text-neutral-500 transition-colors">
            <User className="h-6 w-6" />
          </Link>
          <CartBadge />
        </div>

      </div>
    </header>
  );
}