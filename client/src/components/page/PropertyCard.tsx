import { Property } from "@/lib/types/data-type";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CustomImage from "./CustomImage";

export default function PropertyCard({ property }: { property: Property }) {
  const places_api_key = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  if (!places_api_key)
    throw new Error(
      "NEXT_PUBLIC_GOOGLE_PLACES_API_KEY is missing from your .env.local file"
    );

  return (
    <Link href={"/demo/property/" + property.id}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="space-y-2 cursor-pointer pb-10 px-4"
      >
        <div className="aspect-square w-full h-auto relative">
          <CustomImage
            photo={property.photos[0]}
            provider={property.provider}
          />
        </div>
        <div className="px-1 space-y-10">
          <div className="space-y-1">
            <h1 className="font-bold truncate">{property.name}</h1>
            <h2 className="truncate text-xs text-muted-foreground">
              {property.address.vicinity}
            </h2>
          </div>
          <div className="text-sm font-semibold flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <MapPin className="h-4" />
              <p>{property.distance.toFixed(2)} m</p>
            </span>
            <span className="flex items-center space-x-1">
              <Star className="h-4 fill-primary" />
              <p>3.5</p>
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
