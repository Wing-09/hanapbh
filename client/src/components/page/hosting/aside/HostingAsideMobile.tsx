import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  LineChart,
  MessageCircleMore,
  PanelLeft,
  Settings,
  MapPinHouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HanapBHLogo from "@/components/svg/HanapBHLogo";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function HostingAsideMobile() {
  const pathname = usePathname();
  const items = [
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: (
        <LayoutDashboard className="h-5 w-5 transition-all group-hover:scale-110" />
      ),
    },
    {
      name: "Owned",
      link: "/owned",
      icon: (
        <MapPinHouse className="h-5 w-5 transition-all group-hover:scale-110" />
      ),
    },
    {
      name: "Direct Message",
      link: "/dm",
      icon: (
        <MessageCircleMore className="h-5 w-5 transition-all group-hover:scale-110" />
      ),
    },
    {
      name: "Activity",
      link: "/activity",
      icon: (
        <LineChart className="h-5 w-5 transition-all group-hover:scale-110" />
      ),
    },
    {
      name: "Settings",
      link: "/settings",
      icon: (
        <Settings className="h-5 w-5 transition-all group-hover:scale-110" />
      ),
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            as="/"
            className="h-8 w-8 p-2 bg-primary rounded-full"
          >
            <HanapBHLogo className="h-full w-full fill-background " />
            <span className="sr-only">Hanap BH</span>
          </Link>
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              as={item.link}
              className={cn(
                "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                pathname.startsWith("/hosting" + item.link) &&
                  "text-primary font-bold"
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
