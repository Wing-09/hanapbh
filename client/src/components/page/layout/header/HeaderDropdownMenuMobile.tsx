import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ThemeToggler } from "./ThemeToggler";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  CircleHelp,
  HousePlus,
  LogIn,
  LogOut,
  NotebookPen,
  ReceiptText,
  Settings,
  UserRound,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HeaderDropdownMenuMobile() {
  const { status, data } = useSession();
  const pathname = usePathname();

  const items = [
    {
      name: "Add Your Place",
      link: "/hosting",
      icon: (
        <HousePlus className="h-5 w-5 transition-all group-hover:scale-110" />
      ),
    },
    {
      name: "Help",
      link: "#",
      icon: (
        <CircleHelp className="h-5 w-5 transition-all group-hover:scale-110" />
      ),
    },
    {
      name: "Terms of Service",
      link: "#",
      icon: (
        <ReceiptText className="h-5 w-5 transition-all group-hover:scale-110" />
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
        <Avatar>
          <AvatarImage src={data?.user.photo?.url} />
          <AvatarFallback className="p-2">
            {status === "authenticated" ? (
              data?.user.first_name.slice(0, 1).toUpperCase()
            ) : (
              <UserRound className="h-full stroke-primary" />
            )}
          </AvatarFallback>
        </Avatar>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-8 text-lg">
        {status === "unauthenticated" ? (
          <>
            <Link
              className="flex items-center gap-4 text-foreground font-bold"
              href={"/login?exit=" + pathname}
              as={"/login?exit=" + pathname}
              prefetch
            >
              <LogIn className="h-5 w-5" />
              Login
            </Link>
            <Link
              className="flex items-center gap-4 text-muted-foreground hover:text-foreground"
              href={"/sign-up?exit=" + pathname}
              as={"/sign-up?exit=" + pathname}
              prefetch
            >
              <NotebookPen className="h-5 w-5" />
              Sign up
            </Link>
          </>
        ) : (
          <div className="py-1 w-full flex items-center space-x-5 h-fit">
            <Avatar className="h-8 w-8 ">
              <AvatarImage src={data?.user.photo?.url} />
              <AvatarFallback className="p-2">
                {data?.user.first_name.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="flex items-center space-x-1  font-semibold whitespace-normal truncate">
              <p className="truncate">{data?.user.first_name}</p>
              <p className="truncate">{data?.user.last_name}</p>
            </span>
          </div>
        )}
        {items.map((item) => (
          <Link
            key={item.name}
            href={item.link}
            className={cn(
              "flex items-center gap-4 text-muted-foreground hover:text-foreground",
              pathname.startsWith(item.link) && "text-primary font-bold"
            )}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}

        {/* Toggles theme from light to dark and vice versa */}
        {/* logout button */}
        {status === "authenticated" && (
          <Button
            variant="ghost"
            className="py-2 px-0 cursor-pointer font-bold space-x-3 justify-start text-lg focus-visible:ring-0"
            onClick={() => signOut({ redirect: true, callbackUrl: pathname })}
          >
            <LogOut className="h-5 w-5" />
            <p>Logout</p>
          </Button>
        )}
        <div className="mt-auto">
          <ThemeToggler />
        </div>
      </SheetContent>
    </Sheet>
  );
}
