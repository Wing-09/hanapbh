import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AddPlace() {
  const pathname = usePathname();

  return (
    <Link
      href={
        pathname.startsWith("/demo")
          ? "/demo/hosting?exit=" + pathname
          : "/hosting?exit=" + pathname
      }
    >
      <Button
        variant="ghost"
        className="rounded-full text-muted-foreground mr-20 font-bold"
      >
        Add your place
      </Button>
    </Link>
  );
}
