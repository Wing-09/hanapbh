import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { ThemeToggler } from "./ThemeToggler";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut, UserRound } from "lucide-react";
import CustomLink from "../../demo/CustomLink";

export default function HeaderDropdownMenu() {
  const { status, data } = useSession();
  const pathname = usePathname();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="rounded-full cursor-pointer">
        <Avatar className="h-9 w-9">
          <AvatarImage src={data?.user.photo?.url} />
          <AvatarFallback className="p-2">
            {status === "authenticated" ? (
              data?.user.first_name.slice(0, 1).toUpperCase()
            ) : (
              <UserRound className="h-full" />
            )}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        alignOffset={-15}
        sideOffset={8}
        className="w-[clamp(18rem,_18rem,_95vw)] "
      >
        <DropdownMenuGroup className="space-y-1">
          {status === "unauthenticated" ? (
            <>
              <DropdownMenuItem className="py-0">
                <CustomLink
                  className="py-3 w-full font-bold"
                  href={"/login?exit=" + pathname}
                  title="login"
                >
                  Login
                </CustomLink>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-0">
                <CustomLink
                  className="py-3 w-full "
                  href={"/sign-up?exit=" + pathname}
                  title="sign up"
                >
                  Sign up
                </CustomLink>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem className="py-1">
                <Link
                  className="py-1 w-full flex items-center space-x-5"
                  href="#"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={data?.user.photo?.url} />
                    <AvatarFallback className="p-2">
                      {data?.user.first_name.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex items-center space-x-1  font-semibold whitespace-normal truncate">
                    <p className="truncate">{data?.user.first_name}</p>
                    <p className="truncate">{data?.user.last_name}</p>
                  </span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={cn("py-0", pathname.startsWith("/hosting") && "hidden")}
          >
            <Link
              className="py-3 w-full "
              href={
                pathname.startsWith("/demo")
                  ? "/demo/hosting?exit=" + pathname
                  : "/hosting?exit=" + pathname
              }
            >
              Add your Place
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-0">
            <Link className="py-3 w-full " href="#">
              Help
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-0">
            <Link className="py-3 w-full " href="#">
              Terms of service
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* Toggles theme from light to dark and vice versa */}
          <ThemeToggler />
          {/* logout button */}
          {status === "authenticated" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="py-2 cursor-pointer font-bold space-x-3 justify-center"
                onClick={() => signOut()}
              >
                <p>Logout</p> <LogOut className="h-5" />
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
