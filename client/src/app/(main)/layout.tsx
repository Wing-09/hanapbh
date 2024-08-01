"use client";
import Header from "@/components/page/layout/header/Header";
import UserLocation from "@/components/page/UserLocation";
import { usePathname } from "next/navigation";
import React from "react";

export default function Layout({
  children,
  auth,
}: {
  children: React.ReactNode;
  auth: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <Header />
      {pathname.startsWith("/login") || pathname.startsWith("/sign-up")
        ? auth
        : null}
      {children}
    </>
  );
}
