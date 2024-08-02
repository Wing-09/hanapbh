"use client";
import HanapBHLogo from "@/components/svg/HanapBHLogo";
import Link from "next/link";
import HeaderDropdownMenuMobile from "../../layout/header/HeaderDropdownMenuMobile";
import Navigation from "../../layout/header/Navigation";
import AddPlace from "../../layout/header/AddPlace";
import HeaderDropdownMenu from "../../layout/header/HeaderDropdownMenu";

export default function HostingHeader() {
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
      <span className="hidden sm:flex grow px-8 py-1 items-center justify-between">
        <Link href="/" as="/" prefetch className="flex space-x-5 items-center">
          <HanapBHLogo className="h-6 w-auto fill-primary" />
          <h1 className="text-xl font-bold italic">Hanap BH</h1>
        </Link>
        <HeaderDropdownMenu />
      </span>
    </header>
  );
}
