"use client";
import useHTTPRequest from "@/components/hooks/useHTTPRequest";
import UserLocation from "@/components/page/UserLocation";
import { Property } from "@/lib/types/data-type";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LodgingCardsSkeleton from "@/components/page/loading-skeleton/LodgingCardsSkeleton";
import LodgingCard from "@/components/page/LodgingCard";
import { NearbyLodgingResponse } from "@/lib/types/server-response";
import ListFilter from "@/components/page/ListFilter";
import ListSort from "@/components/page/ListSort";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    distance: 5000,
    property_type: new Map(),
    amenities: new Map(),
  });
  const [sort, setSort] = useState({ name: "", distance: "ascend" });

  const lng = useSearchParams().get("lng");
  const lat = useSearchParams().get("lat");

  const http_request = useHTTPRequest();

  useEffect(() => {
    if (!lat || !lng) return;
    async function getNearbyProperties() {
      try {
        setLoading(true);
        const { data } = await http_request.GET("/v1/property/nearby", {
          latitude: lat,
          longitude: lng,
          page,
          max_distance: filter.distance,
        });
        setProperties((data as NearbyLodgingResponse).result);
        setLoading(false);
      } catch (error) {
        throw error;
      }
    }

    getNearbyProperties();
  }, [lat, lng, page, filter.distance]);

  useEffect(() => {
    if (filter.property_type.size > 0) {
      setProperties((prev) =>
        prev.filter((property) => filter.property_type.has(property.type!))
      );
    }
    if (filter.amenities.size > 0) {
      setProperties((prev) =>
        prev.filter((property) => {
          const l = [];
          filter.amenities.forEach((value) => {
            if (property.amenities.find(value as any)) {
              return true;
            }
          });
        })
      );
    }
  }, [filter.amenities, filter.property_type]);

  useEffect(() => {
    if (!sort.name) return;

    switch (sort.name) {
      case "ascend": {
        setProperties((prev) =>
          prev.toSorted((a, b) => a.name.localeCompare(b.name))
        );
        break;
      }
      case "descend": {
        setProperties((prev) =>
          prev.toSorted((a, b) => b.name.localeCompare(a.name))
        );
        break;
      }
      default:
        break;
    }
  }, [sort.name]);

  useEffect(() => {
    switch (sort.distance) {
      case "ascend": {
        setProperties((prev) =>
          prev.toSorted((a, b) => a.distance - b.distance)
        );
        break;
      }
      case "descend": {
        setProperties((prev) =>
          prev.toSorted((a, b) => b.distance - a.distance)
        );
        break;
      }
      default:
        break;
    }
  }, [sort.distance]);

  return (
    <main className="grid grid-rows-[auto_1fr] sm:px-[10vw] py-8 space-y-8 scroll-smooth">
      <div className="flex items-center mx-5 space-x-1">
        <ListFilter filter={filter} setFilter={setFilter} />
        <ListSort sort={sort} setSort={setSort} />
      </div>
      <UserLocation>
        <section className="grid grid-cols-1 gap-10 sm:grid-cols-4 scroll-smooth">
          {loading ? (
            <LodgingCardsSkeleton />
          ) : (
            properties.map((lodging) => (
              <LodgingCard key={lodging.id} lodging={lodging} />
            ))
          )}
        </section>
      </UserLocation>
    </main>
  );
}
