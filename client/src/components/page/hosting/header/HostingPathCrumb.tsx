import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function HostingPathCrumb() {
  const pathname = usePathname();
  const pathname_list = pathname.split("/").filter((path) => path);

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {pathname_list.map((path, index) => (
          <>
            <BreadcrumbItem key={index}>
              <BreadcrumbLink asChild>
                <Link
                  href={"/" + path}
                  as={"/" + path}
                  className={cn(
                    index === pathname_list.length - 1 &&
                      "font-bold text-primary"
                  )}
                >
                  {path.slice(0, 1).toUpperCase() + path.slice(1)}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index !== pathname_list.length - 1 && (
              <BreadcrumbSeparator key={path} />
            )}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
