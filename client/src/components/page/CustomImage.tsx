import { Photo, Property } from "@/lib/types/data-type";
import Image from "next/image";

type P = {
  /**
   *  @type {Photo} - The photo model
   *  @see {@link Photo} - for the type definition
   */
  photo: Photo | null;
  /**
   * @type {Property["provider"]} - the property provider defaults to `DB`
   * @see {@link Property} - for the type definition
   */
  provider?: Property["provider"];
};

/**
 *
 *  Custom image component that checks the provider for correct url handing
 *
 * @returns {React.ReactNode} Image component
 */

export default function CustomImage({
  photo,
  provider = "DB",
}: P): React.ReactNode {
  const places_api_key = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  if (!places_api_key)
    throw new Error(
      "NEXT_PUBLIC_GOOGLE_PLACES_API_KEY is missing from your .env.local file"
    );

  return photo ? (
    provider === "GOOGLE" ? (
      <Image
        src={
          "https://maps.googleapis.com/maps/api/place/photo?key=" +
          places_api_key +
          "&photo_reference=" +
          photo.url +
          "&maxwidth=" +
          photo.width +
          "&maxheight" +
          photo.height
        }
        alt={"photo"}
        width={photo.width}
        height={photo.height}
        className="w-full h-full object-cover rounded-xl"
        priority
      />
    ) : (
      <Image
        src={photo.url}
        alt={"photo"}
        width={photo.width}
        height={photo.height}
        className="w-full h-full object-cover rounded-xl"
        priority
      />
    )
  ) : (
    <div className="w-full h-full rounded-xl grid place-content-center font-bold text-xl bg-muted">
      <p>No Image</p>
    </div>
  );
}
