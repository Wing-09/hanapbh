import MonthlyRate from "@/components/page/hosting/dashboard/MonthlyRate";
import OccupancyRate from "@/components/page/hosting/dashboard/OccupancyRate";
import Occupants from "@/components/page/hosting/dashboard/Occupants";
import OwnedLodging from "@/components/page/hosting/dashboard/OwnedLodging";
import BookingRequest from "@/components/page/hosting/dashboard/PendingRequest";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  MoreVertical,
  Truck,
} from "lucide-react";

export default function page() {
  return (
    <main className="gap-8 px-5 grow">
      <div className="grid grid-cols-4 gap-4">
        <OccupancyRate />
        <Occupants />
        <MonthlyRate />
        <BookingRequest />
      </div>
      {/* <OwnedLodging /> */}
    </main>
  );
}
