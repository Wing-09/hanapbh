import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ThemeToggler } from "./ThemeToggler";

export default function HeaderDropdownMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback className="p-2">
            <UserIcon className="h-full stroke-primary" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        alignOffset={-30}
        sideOffset={10}
        className="w-[clamp(18rem,_18rem,_95vw)] "
      >
        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem className="py-0">
            <Link
              className="py-3 w-full font-bold"
              href="/login"
              as="/login"
              prefetch
            >
              Login
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-0">
            <Link className="py-3 w-full " href="/sign-up">
              Sign up
            </Link>
          </DropdownMenuItem>
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
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
