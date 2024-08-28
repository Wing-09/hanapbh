"use client";

import HanapBHLogo from "@/components/svg/HanapBHLogo";
import Link from "next/link";
import React from "react";
import AddPlace from "./AddPlace";
import HeaderDropdownMenu from "./HeaderDropdownMenu";
import Navigation from "./Navigation";
import HeaderDropdownMenuMobile from "./HeaderDropdownMenuMobile";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-screen flex shadow-sm items-center sticky top-0 z-10 bg-background">
      {/* Desktop */}
      <span className="hidden sm:flex grow px-10 py-1 items-center">
        <Link
          href={pathname.startsWith("/demo") ? "/demo/nearby" : "/nearby"}
          className="flex space-x-5 items-center"
        >
          <HanapBHLogo className="h-6 w-auto fill-primary" />
          <h1 className="text-xl font-bold italic">Hanap BH</h1>
        </Link>
        <Navigation />
        <AddPlace />
        <HeaderDropdownMenu />
      </span>
      {/* Mobile */}
      <span className="sm:hidden grow space-y-2">
        <div className="flex justify-between grow px-4 py-2">
          <Link
            href={pathname.startsWith("/demo") ? "/demo/nearby" : "/nearby"}
            className="flex space-x-3 items-center"
          >
            <HanapBHLogo className="h-5 w-auto fill-primary" />
            <h1 className="text-xl font-bold italic">Hanap BH</h1>
          </Link>
          <HeaderDropdownMenuMobile />
        </div>
        <Navigation />
      </span>
    </header>
  );
}
