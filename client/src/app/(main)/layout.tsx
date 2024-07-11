import HanapBHLogo from "@/components/HanapBHLogo";
import Header from "@/components/page/layout/header/Header";
import Link from "next/link";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
