"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Globe, Map, MapPinned } from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const items = [
    {
      name: "Nearby",
      link: "/nearby",
      icon: <MapPinned className="h-6" />,
    },
    { name: "Browse", link: "/browse", icon: <Globe className="h-6" /> },
    { name: "Map", link: "/map", icon: <Map className="h-6" /> },
  ];

  return (
    <>
      <nav className="hidden sm:inline-block mx-auto space-x-10 pl-16">
        {items.map((item) => (
          <Link key={item.name} href={item.link} as={item.link}>
            <Button
              variant="ghost"
              className={cn(
                "text-lg font-bold p-0 hover:bg-transparent hover:text-primary",
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
      <nav className="flex sm:hidden w-full justify-evenly shadow-sm space-x-5">
        {items.map((item) => (
          <Link
            href={item.link}
            key={item.name}
            as={item.link}
            className={cn(
              "grow flex justify-center py-1 stroke-[5px]",
              pathname.startsWith(item.link)
                ? "text-primary  border-b-2 border-primary"
                : "text-muted-foreground"
            )}
          >
            {item.icon}
          </Link>
        ))}
      </nav>
    </>
  );
}
