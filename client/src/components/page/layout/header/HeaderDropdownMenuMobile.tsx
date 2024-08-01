import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowRightEndOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { ThemeToggler } from "./ThemeToggler";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function HeaderDropdownMenuMobile() {
  const { status, data } = useSession();
  const pathname = usePathname();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="rounded-full">
        <Avatar>
          <AvatarImage src={data?.user.photo?.url} />
          <AvatarFallback className="p-2">
            {status === "authenticated" ? (
              data?.user.first_name.slice(0, 1).toUpperCase()
            ) : (
              <UserIcon className="h-full stroke-primary" />
            )}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        alignOffset={-11}
        sideOffset={50}
        className="w-screen"
      >
        <DropdownMenuGroup className="space-y-1">
          {status === "unauthenticated" ? (
            <>
              <DropdownMenuItem className="py-0">
                <Link
                  className="py-3 w-full font-bold"
                  href={"/login?exit=" + pathname}
                  as={"/login?exit=" + pathname}
                  prefetch
                >
                  Login
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-0">
                <Link
                  className="py-3 w-full "
                  href={"/sign-up?exit=" + pathname}
                  as={"/sign-up?exit=" + pathname}
                  prefetch
                >
                  Sign up
                </Link>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem className="py-2">
                <Link
                  className="py-1 w-full flex items-center space-x-5"
                  href="/sign-up"
                >
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
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="py-0">
            <Link className="py-3 w-full " href="#">
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
                onClick={() =>
                  signOut({ redirect: true, callbackUrl: pathname })
                }
              >
                <p>Logout</p> <ArrowRightEndOnRectangleIcon className="h-5" />
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
