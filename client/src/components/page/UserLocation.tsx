"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import useHTTPRequest from "../hooks/useHTTPRequest";
import { MapPinOff, MapPinX, MapPinXInside } from "lucide-react";

export default function UserLocation({
  children,
}: {
  children: React.ReactNode;
}) {
  const [out_of_bound, setOutOfBound] = useState(false);

  const location = useSearchParams().get("location");
  const lat = useSearchParams().get("lat");
  const lng = useSearchParams().get("lng");

  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const http_request = useHTTPRequest();

  useEffect(() => {
    if (!navigator.geolocation.getCurrentPosition) {
      toast({
        description: "Location detector is not supported in your browser",
      });
      router.replace(pathname + "?location=none");
      return;
    }
    function getPosition() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          router.replace(
            pathname +
              "?lng=" +
              position.coords.longitude +
              "&lat=" +
              position.coords.latitude
          );
        },
        (error) => {
          if (error.PERMISSION_DENIED)
            router.replace(pathname + "?location=off");
        }
      );
    }
    if (location !== "none") getPosition();
  }, []);

  useEffect(() => {
    if (!lat || !lng) return;

    async function validateUserLocation() {
      try {
        const { status } = await http_request.POST("/v1/location/validate", {
          latitude: lat,
          longitude: lng,
        });

        setOutOfBound(status === "OUT_OF_BOUND");
      } catch (error) {
        throw error;
      }
    }
    validateUserLocation();
  }, [lat, lng]);

  if (location === "off")
    return (
      <main className="my-auto grid place-content-center space-y-5">
        <MapPinOff className="h-auto w-[5vw] stroke-2 stroke-white mx-auto fill-muted-foreground" />
        <span className="text-lg text-muted-foreground text-center">
          <p>Location access is denied</p>
          <p>
            To continue using this site please allow it to access your location
          </p>
        </span>
      </main>
    );
  if (location === "none")
    return (
      <main className="my-auto grid place-content-center space-y-5">
        <MapPinXInside className="h-auto w-[5vw] stroke-2 stroke-white mx-auto fill-muted-foreground" />
        <p className="text-center text-lg text-muted-foreground">
          Location detector is not supported in your browser no data will be
          displayed
        </p>
      </main>
    );

  if (out_of_bound)
    return (
      <main className="my-auto grid place-content-center space-y-5">
        <MapPinX className="h-auto w-[5vw] stroke-2 stroke-white mx-auto fill-muted-foreground" />
        <span className="text-center text-lg text-muted-foreground">
          <p>
            Looks like your trying to access the app outside the Philippines.
          </p>
          <p>Nothing wil be displayed but you can still use the search bar</p>
        </span>
      </main>
    );
  return children;
}
