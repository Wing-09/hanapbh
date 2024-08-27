"use client";
import Header from "@/components/page/layout/header/Header";
import { usePathname } from "next/navigation";
import React, { Suspense } from "react";

export default function Layout({
  children,
  auth,
}: {
  children: React.ReactNode;
  auth: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Suspense>
      <div className="grid grid-rows-[auto_1fr] w-screen h-dvh overflow-x-hidden">
        <Header />
        {pathname.startsWith("/demo/login") ||
        pathname.startsWith("/demo/sign-up")
          ? auth
          : null}
        {children}
      </div>
    </Suspense>
  );
}
