import { Router } from "express";
import getDistance from "../../lib/distance";
import { PhotoType } from "../../database/model/Photo";
import { LodgingType } from "../../database/model/Lodging";
import { GooglePlacesAPINearbyResponse } from "../../lib/types/google-places-api-types";
import checkLocation from "../../lib/middleware/checklocation";
import JSONResponse from "../../lib/json-response";
import databaseNearbyLodgings from "./lodging/database-nearby-lodging-query";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

export default function lodging_v1_router(
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
  done: () => void
) {
  const places_api_key = process.env.GOOGLE_PLACES_API_KEY;
  if (!places_api_key)
    throw new Error("GOOGLE_PLACES_API_KEY is missing from your .env file");
  fastify.get<{ Querystring: Record<string, string> }>(
    "/nearby",
    async (request, reply) => {
      try {
        const { latitude, longitude } = request.query;
        const { page, google_next_page_token, max_distance } = request.query;

        if (!page || !max_distance)
          return reply
            .code(400)
            .send(
              JSONResponse(
                "BAD_REQUEST",
                "page and max_distance is required as a query parameters"
              )
            );

        if (!Number(page) || !Number(max_distance))
          return reply
            .code(400)
            .send(
              JSONResponse(
                "BAD_REQUEST",
                "page and max_distance value must be a number"
              )
            );

        const skip = 20 * (Number(page) - 1);

        const database_lodgings = await databaseNearbyLodgings({
          longitude: Number(longitude),
          latitude: Number(latitude),
          max_distance: Number(max_distance),
          skip,
        });

        if (database_lodgings.length === 20)
          return reply
            .code(200)
            .send(JSONResponse("OK", "request successful", database_lodgings));

        let places_api_response;

        if (google_next_page_token === null) {
          if (database_lodgings.length > 1) {
            return reply
              .code(200)
              .send(
                JSONResponse("OK", "request successful", database_lodgings)
              );
          } else {
            return reply
              .code(404)
              .send(JSONResponse("NOT_FOUND", "no more nearby lodging found"));
          }
        }
        if (google_next_page_token) {
          places_api_response = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/send?key=${places_api_key}&token=${google_next_page_token}`
          );
        } else {
          places_api_response = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/send?key=${places_api_key}&location=${latitude}%2C${longitude}&type=lodging&radius=${max_distance}`
          );
        }

        const places_api_response_json =
          (await places_api_response.json()) as GooglePlacesAPINearbyResponse;

        const google_nearby_place: (Omit<LodgingType, "photos"> & {
          id: string;
          photos: PhotoType[];
        })[] = [];

        for (const place of places_api_response_json.results) {
          google_nearby_place.push({
            id: place.place_id,
            name: place.name,
            description: "",
            photos: place.photos
              ? place.photos.map((photo) => ({
                  type: "LODGING",
                  id: "",
                  url: photo.photo_reference,
                  height: photo.height,
                  width: photo.width,
                  lodging_id: null,
                  date_created: new Date(),
                  last_updated: new Date(),
                }))
              : [],
            provider: "GOOGLE",
            offers: [],
            favored_by: [],
            rated_by: [],
            rooms: [],
            location: {
              type: "Point",
              coordinates: [
                place.geometry.location.lng,
                place.geometry.location.lat,
              ],
            },
            address: {
              vicinity: place.vicinity,
              street: "",
              barangay: "",
              municipality_city: "",
              province: "",
            },
            distance: getDistance(
              { longitude: Number(longitude), latitude: Number(latitude) },
              {
                longitude: place.geometry.location.lng,
                latitude: place.geometry.location.lat,
              }
            ),
            date_created: new Date(),
            last_updated: new Date(),
          });
        }
        return reply.code(200).send(
          JSONResponse("OK", "request successful", {
            google_next_page_token: places_api_response_json.next_page_token,
            result: [...google_nearby_place, ...database_lodgings].sort(
              (a, b) => a.distance - b.distance
            ),
          })
        );
      } catch (error) {
        console.error(error);
        return reply.code(500).send(JSONResponse("INTERNAL_SERVER_ERROR"));
      }
    }
  );

  done();
}
