"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function CustomLink({
  children,
  href,
  title,
  className,
}: {
  children: React.ReactNode;
  href: string;
  title: string;
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      onClick={(e) => {
        if (pathname.startsWith("/demo")) {
          e.preventDefault();
          toast.warning(title + " is not available on demo mode", {
            action: {
              label: "ok",
              onClick: () => null,
            },
          });
        }
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
