import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "@heroicons/react/24/outline";

export default function HeaderDropdownMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback className="p-2">
            <UserIcon className="h-full stroke-primary" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
}
