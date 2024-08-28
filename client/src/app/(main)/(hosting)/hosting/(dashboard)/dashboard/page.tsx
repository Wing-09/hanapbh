"use client";

import MonthlyRate from "@/components/page/hosting/dashboard/MonthlyRate";
import OccupancyRate from "@/components/page/hosting/dashboard/OccupancyRate";
import Occupants from "@/components/page/hosting/dashboard/Occupants";
import Properties from "@/components/page/hosting/dashboard/Properties";
import BookingRequest from "@/components/page/hosting/dashboard/PendingRequest";

export default function page() {
  return (
    <main className="space-y-8 p-5 grow">
      <div className="grid grid-cols-4 gap-4">
        <OccupancyRate />
        <Occupants />
        <MonthlyRate />
        <BookingRequest />
      </div>
      <Properties />
    </main>
  );
}
