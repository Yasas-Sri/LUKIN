"use client"

import Link from "next/link"
import type { Category } from "@/lib/types"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const groups: { key: Category["group"]; label: string }[] = [
  { key: "women", label: "Women" },
  { key: "men", label: "Men" },
  { key: "accessories", label: "Accessories" },
]

export function Navigationbar({ categories }: { categories: Category[] }) {
  return (
    <div className="w-full flex justify-center items-center">
      <NavigationMenu>
        <NavigationMenuList className="flex-wrap">
          {groups.map((group) => {
            const items = categories.filter((c) => c.group === group.key)
            if (items.length === 0) return null
            return (
              <NavigationMenuItem key={group.key}>
                <NavigationMenuTrigger>{group.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[250px] gap-1 p-1">
                    {items.map((cat) => (
                      <li key={cat.id}>
                        <NavigationMenuLink asChild>
                          <Link href={`/category/${cat.slug}`}>
                            <div className="text-sm font-medium">{cat.name}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
