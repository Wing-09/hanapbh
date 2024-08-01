import HanapBHLogo from "@/components/svg/HanapBHLogo";
import Link from "next/link";
import React from "react";
import AddPlace from "./AddPlace";
import HeaderDropdownMenu from "./HeaderDropdownMenu";
import Navigation from "./Navigation";
import HeaderDropdownMenuMobile from "./HeaderDropdownMenuMobile";

export default function Header() {
  return (
    <header className="w-screen flex border-b shadow-sm items-center ">
      <span className="sm:hidden grow space-y-2">
        <div className="flex justify-between grow px-3 py-2">
          <Link
            href="/"
            as="/"
            prefetch
            className="flex space-x-3 items-center"
          >
            <HanapBHLogo className="h-5 w-auto fill-primary" />
            <h1 className="text-xl font-bold italic">Hanap BH</h1>
          </Link>
          <HeaderDropdownMenuMobile />
        </div>
        <Navigation />
      </span>
      <span className="hidden sm:flex grow px-8 py-1">
        <Link href="/" as="/" prefetch className="flex space-x-5 items-center">
          <HanapBHLogo className="h-6 w-auto fill-primary" />
          <h1 className="text-xl font-bold italic">Hanap BH</h1>
        </Link>
        <Navigation />
        <AddPlace />
        <HeaderDropdownMenu />
      </span>
    </header>
  );
}
