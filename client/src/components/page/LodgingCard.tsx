import { Lodging } from "@/lib/types/data-type";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import Image from "next/image";

export default function LodgingCard({ lodging }: { lodging: Lodging }) {
  const places_api_key = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  if (!places_api_key)
    throw new Error(
      "NEXT_PUBLIC_GOOGLE_PLACES_API_KEY is missing from your .env.local file"
    );

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="space-y-2 cursor-pointer pb-10 px-4"
    >
      <span className="aspect-square w-full h-auto relative">
        {lodging.photos.length > 0 ? (
          <Image
            src={
              "https://maps.googleapis.com/maps/api/place/photo?key=" +
              places_api_key +
              "&photo_reference=" +
              lodging.photos[0].url +
              "&maxwidth=" +
              lodging.photos[0].width +
              "&maxheight" +
              lodging.photos[0].height
            }
            alt={lodging.name}
            width={lodging.photos[0].width}
            height={lodging.photos[0].height}
            className="aspect-square w-full h-auto object-cover rounded-xl"
            priority
          />
        ) : (
          <div className="aspect-square w-full h-auto rounded-xl grid place-content-center font-bold text-xl bg-muted">
            <p>No Image</p>
          </div>
        )}
      </span>
      <div className="px-1 space-y-5">
        <span className="space-y-1">
          <h1 className="font-bold truncate">{lodging.name}</h1>
          <h2 className="truncate text-xs text-muted-foreground">
            {lodging.address.vicinity}
          </h2>
        </span>
        <div className="text-sm font-semibold">
          <span className="flex items-center space-x-1">
            <MapPin className="h-4" />
            <p>{lodging.distance.toFixed(2)} KM</p>
          </span>
          <span>{}</span>
        </div>
      </div>
    </motion.div>
  );
}
