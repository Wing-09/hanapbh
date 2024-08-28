"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Property } from "@/lib/types/data-type";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

/**
 *
 * A  `wrapper` for the `PropertyCard` component that provides a link to the property page if the
 * provider is`"DB"` and will provide a dialog if otherwise
 *
 * @param {Property["id"]} id - The property id
 * @param {Property["provider"]} provider - `"DB"` or `"GOOGLE"`
 * @param {React.ReactNode} children - The `PropertyCard` component
 *
 */

export default function PropertyLink({
  id,
  provider,
  children,
}: {
  id: Property["id"];
  provider: Property["provider"];
  children: React.ReactNode;
}) {
  const path_name = usePathname();
  return provider === "DB" ? (
    <Link
      href={
        path_name.startsWith("/demo")
          ? "/demo/property/" + id
          : "/property/" + id
      }
    >
      {children}
    </Link>
  ) : (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <p>
          The details for this property is provided by GOOGLE Maps Database,
          there are no further details
        </p>
      </DialogContent>
    </Dialog>
  );
}
