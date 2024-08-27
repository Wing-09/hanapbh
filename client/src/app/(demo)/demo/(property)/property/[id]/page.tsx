"use client";

import useHTTPRequest from "@/components/hooks/useHTTPRequest";
import CustomImage from "@/components/page/CustomImage";
import { Button } from "@/components/ui/button";
import { Property } from "@/lib/types/data-type";
import { ServerResponse } from "@/lib/types/server-response";
import { cn } from "@/lib/utils";
import { Star, StarHalf } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property>();
  const from = useSearchParams().get("f");
  const [review_avg, setReviewAvg] = useState(0);
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

      const d = data as Property;
      setProperty(d);
      setReviewAvg(
        d?.reviews.length
          ? d?.reviews
              .map((review) => review.rate)
              .reduce((latest, rate) => latest + rate) / d.reviews.length
          : 0
      );
    }

    getProperty();
  }, []);

  if (response_status !== "OK") return null;

  return (
    <main className="relative w-screen py-12 px-10 space-y-8">
      <header className="flex items-start justify-between">
        <div className="flex items-start space-x-10">
          <span>
            <h1 className="text-3xl font-bold">{property?.name}</h1>
            <h2 className="text-muted-foreground">
              {property?.address.vicinity}
            </h2>
          </span>
          {Array.from({
            length: 5,
          }).map((_, index) =>
            Math.floor(review_avg) === index + 1 ? (
              Math.floor(review_avg) !== review_avg ? (
                <StarHalf key={index} className="fill-primary" />
              ) : (
                <Star key={index} className="fill-primary" />
              )
            ) : (
              <Star
                key={index}
                className={cn(index + 1 < review_avg && "fill-primary")}
              />
            ) 
          )}
        </div>
        <div className="space-x-4">
          <Link href={from ? from : "/demo"}>
            <Button size="sm">Go Back</Button>
          </Link>
        </div>
      </header>
      <div className="flex  justify-between">
        <div>
          <h1 className="font-2xl font-bold">Description</h1>
        </div>
        <div className="aspect-video w-auto h-[70dvh] overflow-hidden">
          <CustomImage
            photo={property?.photos ? property?.photos[0] : null}
            provider={property?.provider}
          />
        </div>
      </div>
    </main>
  );
}
