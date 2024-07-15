import HanapBHLogo from "@/components/svg/HanapBHLogo";
import Link from "next/link";
import React from "react";
import AddPlace from "./AddPlace";
import HeaderDropdownMenu from "./HeaderDropdownMenu";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className="w-screen flex border-b shadow-sm py-1 px-10 items-center ">
      <Link href="/" as="/" prefetch className="flex space-x-5 items-center">
        <HanapBHLogo className="h-6 w-auto fill-primary" />
        <h1 className="text-xl font-bold italic">Hanap BH</h1>
      </Link>
      <Navigation />
      <AddPlace />
      <HeaderDropdownMenu />
    </header>
  );
}
