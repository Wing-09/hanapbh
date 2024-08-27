"use client";

import useHTTPRequest from "@/components/hooks/useHTTPRequest";
import CustomImage from "@/components/page/CustomImage";
import { Button } from "@/components/ui/button";
import { Property } from "@/lib/types/data-type";
import { ServerResponse } from "@/lib/types/server-response";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property>();
  const from = useSearchParams().get("f");

  const [response_status, setResponseStatus] =
    useState<ServerResponse["status"]>();

  const http_request = useHTTPRequest();

  useEffect(() => {
    async function getProperty() {
      const { data, status } = await http_request.GET(
        "/v1/property/" + params.id
      );

      setResponseStatus(status);
      if (status !== "OK") return;

      setProperty(data as Property);
    }

    getProperty();
  }, []);

  if (response_status !== "OK") return null;

  return (
    <div className="relative w-screen py-12 px-5">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{property?.name}</h1>
        <div className="space-x-4">
          <Link href={from ? from : "/"}>
            <Button size="sm">Go Back</Button>
          </Link>
          <Button size="lg"> Book Now</Button>
        </div>
      </header>
      <div className="aspect-video w-full h-auto rounded-l-sm">
        <CustomImage
          photo={property?.photos ? property?.photos[0] : null}
          provider={property?.provider}
        />  
      </div>
    </div>
  );
}
