import HanapBHLogo from "@/components/svg/HanapBHLogo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home,
  LayoutDashboard,
  LineChart,
  MapPinHouse,
  MessageCircleMore,
  Settings,
} from "lucide-react";
import Link from "next/link";

export default function HostingAside() {
  const items = [
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: (
        <LayoutDashboard className="h-5 w-5 transition-all group-hover:scale-110" />
      ),
    },
    {
      name: "Properties",
      link: "/properties",
      icon: (
        <MapPinHouse className="h-5 w-5 transition-all group-hover:scale-110" />
      ),
    },
    {
      name: "Message",
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
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                as="/"
                className=" h-8 w-8 p-2 bg-primary rounded-full"
              >
                <HanapBHLogo className="h-full w-full fill-background " />
                <span className="sr-only">Hanap BH</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">hanap bh</TooltipContent>
          </Tooltip>
          {items.map((item) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.link}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  {item.icon}
                  <span className="sr-only">{item.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.name}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
