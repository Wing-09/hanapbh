"use client";
import useHTTPRequest from "@/components/hooks/useHTTPRequest";
import UserLocation from "@/components/page/UserLocation";
import { Property } from "@/lib/types/data-type";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LodgingCardsSkeleton from "@/components/page/loading-skeleton/LodgingCardsSkeleton";
import PropertyCard from "@/components/page/PropertyCard";
import ListFilter from "@/components/page/ListFilter";
import ListSort from "@/components/page/ListSort";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LoadingSvg from "@/components/svg/LoadingSvg";

export default function Page() {
  const [loading, setLoading] = useState({ initial: true, refetching: false });
  const [properties, setProperties] = useState<Property[]>([]);
  const [modified_list, setModifiedList] = useState<Property[]>([]);
  const [page, setPage] = useState<number | null>(1);
  const [filter, setFilter] = useState({
    distance: 500,
    property_type: new Map(),
    amenities: new Map(),
  });
  const [sort, setSort] = useState({ name: "", distance: "ascend" });

  const lng = useSearchParams().get("lng");
  const lat = useSearchParams().get("lat");

  const http_request = useHTTPRequest();

  async function getNearbyProperties() {
    try {
      const { data } = await http_request.GET("/v1/property/nearby", {
        latitude: lat,
        longitude: lng,
        page,
        max_distance: filter.distance,
      });
      setProperties((prev) => [...prev, ...(data as Property[])]);
      if (!(data as Property[]).length) setPage(null);
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    if (!lat || !lng) return;
    async function initialFetch() {
      setLoading((prev) => ({ ...prev, initial: true }));

      await getNearbyProperties();
      setLoading((prev) => ({ ...prev, initial: false }));
    }
    initialFetch();
  }, [lat, lng]);

  useEffect(() => {
    if (page === 1) return;
    async function reFetch() {
      setLoading((prev) => ({ ...prev, refetching: true }));
      await getNearbyProperties();
      setLoading((prev) => ({ ...prev, refetching: false }));
    }
    reFetch();
  }, [page]);

  useEffect(() => {
    if (!properties.length) return;
    if (!filter.distance) return;
    if (
      filter.distance === 100 ||
      filter.distance === 200 ||
      filter.distance === 300 ||
      filter.distance === 400 ||
      filter.distance === 500
    ) {
      setModifiedList(properties.filter((p) => p.distance <= filter.distance));
      return;
    }
    getNearbyProperties();
  }, [filter.distance, properties]);

  useEffect(() => {
    if (!properties.length) return;

    if (filter.property_type.size)
      setModifiedList((prev) =>
        prev.filter((property) => filter.property_type.has(property.type!))
      );
    if (filter.amenities.size) {
      setModifiedList((prev) =>
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

    if (!filter.property_type.size && !filter.amenities.size)
      setModifiedList([]);
  }, [filter.amenities, filter.property_type, properties]);

  useEffect(() => {
    if (!properties.length) return;

    if (!sort.name) return;

    switch (sort.name) {
      case "ascend": {
        modified_list.length
          ? setModifiedList((prev) =>
              prev.toSorted((a, b) => a.name.localeCompare(b.name))
            )
          : setProperties((prev) =>
              prev.toSorted((a, b) => a.name.localeCompare(b.name))
            );
        break;
      }
      case "descend": {
        modified_list.length
          ? setModifiedList((prev) =>
              prev.toSorted((a, b) => b.name.localeCompare(a.name))
            )
          : setProperties((prev) =>
              prev.toSorted((a, b) => b.name.localeCompare(a.name))
            );
        break;
      }
      default:
        break;
    }
  }, [sort.name]);

  useEffect(() => {
    if (!properties.length) return;

    switch (sort.distance) {
      case "ascend": {
        modified_list.length
          ? setModifiedList((prev) =>
              prev.toSorted((a, b) => a.distance - b.distance)
            )
          : setProperties((prev) =>
              prev.toSorted((a, b) => a.distance - b.distance)
            );
        break;
      }
      case "descend": {
        modified_list.length
          ? setModifiedList((prev) =>
              prev.toSorted((a, b) => b.distance - a.distance)
            )
          : setProperties((prev) =>
              prev.toSorted((a, b) => b.distance - a.distance)
            );
        break;
      }
      default:
        break;
    }
  }, [sort.distance]);

  return (
    <main className="grid grid-rows-[auto_1fr_auto] sm:px-[10vw] py-8 space-y-8 scroll-smooth">
      <div className="flex items-center mx-5 space-x-1">
        <ListFilter filter={filter} setFilter={setFilter} />
        <ListSort sort={sort} setSort={setSort} />
      </div>
      <UserLocation>
        <section className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:gap-4 scroll-smooth">
          {loading.initial ? (
            <LodgingCardsSkeleton />
          ) : modified_list.length ? (
            modified_list.map((property) => (
              <PropertyCard key={property.name} property={property} />
            ))
          ) : (
            properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          )}
        </section>
      </UserLocation>
      <Button
        className={cn(
          "w-fit justify-self-center rounded-full",
          !page || (loading.initial && "hidden")
        )}
        variant="ghost"
        onClick={() => setPage((prev) => prev! + 1)}
      >
        {loading.refetching ? (
          <LoadingSvg className="h-8 w-auto fill-primary" />
        ) : (
          "Load More"
        )}
      </Button>
    </main>
  );
}
