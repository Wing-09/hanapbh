"use client";
import useHTTPRequest from "@/components/hooks/useHTTPRequest";
import UserLocation from "@/components/page/UserLocation";
import { Lodging } from "@/lib/types/data-type";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LodgingCardsSkeleton from "@/components/page/loading-skeleton/LodgingCardsSkeleton";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import LodgingCard from "@/components/page/LodgingCard";
import { NearbyLodgingResponse } from "@/lib/types/server-response";

export default function Page() {
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
        setLodgings((data as NearbyLodgingResponse).result);
        setLoading(false);
      } catch (error) {
        throw error;
      }
    }

    getNearbyLodgings();
  }, [lat, lng, page, max_distance]);

  return (
    <main className="grid grid-rows-[auto_1fr] sm:px-[10vw] py-[5dvh] space-y-10">
      <Input />
      <UserLocation>
        <section className="grid grid-cols-1 sm:grid-cols-4">
          {loading ? (
            <LodgingCardsSkeleton />
          ) : (
            lodgings.map((lodging) => (
              <LodgingCard key={lodging.id} lodging={lodging} />
            ))
          )}
        </section>
      </UserLocation>
    </main>
  );
}
