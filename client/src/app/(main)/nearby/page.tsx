"use client";
import useHTTPRequest from "@/components/hooks/useHTTPRequest";
import LoadingSvg from "@/components/svg/LoadingSvg";
import UserLocation from "@/components/page/UserLocation";
import { Lodging } from "@/lib/types/data-type";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LodgingCardsSkeleton from "@/components/page/loading-skeleton/LodgingCardsSkeleton";
import { Input } from "@/components/ui/input";

export default function page() {
  const [loading, setLoading] = useState(true);
  const [lodgings, setLodgings] = useState<Lodging[]>([]);
  const [page, setPage] = useState(1);
  const [max_distance, setDistance] = useState(1000);
  const lng = useSearchParams().get("lng");
  const lat = useSearchParams().get("lat");

  const http_request = useHTTPRequest();

  useEffect(() => {
    if (!lat || !lng) return;
    async function getNearbyLodgings() {
      try {
        setLoading(true);
        const { data } = await http_request.GET("/v1/lodging/nearby", {
          latitude: lat,
          longitude: lng,
          page,
          max_distance,
        });
        setLodgings(data as Lodging[]);
        console.log(data);
        setLoading(false);
      } catch (error) {
        throw error;
      }
    }

    getNearbyLodgings();
  }, [lat, lng, page, max_distance]);

  return (
    <main className="grid grid-rows-[auto_1fr] px-[10vw] py-[5dvh] space-y-10">
      <Input />
      <UserLocation>
        <ul className="grid grid-cols-4 gap-5">
          <LodgingCardsSkeleton />
        </ul>
      </UserLocation>
    </main>
  );
}
