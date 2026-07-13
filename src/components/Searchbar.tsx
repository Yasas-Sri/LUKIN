"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchBar() {
  const router = useRouter();

  return (
    <form
      className="relative w-full max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q")?.toString().trim();
        if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
      }}
    >
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        type="search"
        name="q"
        placeholder="Search for items..."
        className="pl-10 pr-4 rounded-full bg-neutral-100 border-none focus-visible:ring-1 focus-visible:ring-neutral-400"
      />
    </form>
  );
}
