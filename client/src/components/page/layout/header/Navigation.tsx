"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const items = [
    { name: "Nearby", link: "/nearby" },
    { name: "Browse", link: "/browse" },
    { name: "Map", link: "/map" },
  ];

  return (
    <nav className="mx-auto space-x-10 pl-16">
      {items.map((item) => (
        <Link key={item.name} href={item.link} as={item.link} prefetch>
          <Button
            variant="ghost"
            className={cn(
              "text-lg font-bold p-0 hover:bg-transparent",
              pathname.startsWith(item.link)
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            {item.name}
          </Button>
        </Link>
      ))}
    </nav>
  );
}
