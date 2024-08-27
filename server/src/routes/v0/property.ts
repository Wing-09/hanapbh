import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { startSession } from "mongoose";
import Photo from "../../database/model/Photo";
import Property, { PropertyType } from "../../database/model/Property";
import User from "../../database/model/User";
import JSONResponse from "../../lib/json-response";
import { GooglePlacesAPINearbyResponse } from "../../lib/types/google-places-api-types";

export default function propertyV0Router(
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
  done: () => void
) {
  const places_api_key = process.env.GOOGLE_PLACES_API_KEY;
  if (!places_api_key)
    throw new Error("GOOGLE_PLACES_API_KEY is missing from your .env file");

  //create router

  fastify.post<{ Body: { latitude: number; longitude: number } }>(
    "/save",
    async (request, reply) => {
      try {
        const session = await startSession();
        session.startTransaction();

        const { latitude, longitude } = request.body;

        const places_api_response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${places_api_key}&location=${latitude}%2C${longitude}&type=property&rankby=distance`
        );

        const places_api_response_json =
          (await places_api_response.json()) as GooglePlacesAPINearbyResponse;

        let next_page_token = places_api_response_json.next_page_token;

        const user = await User.findOne({ _id: "66ab0b4833f908410394cc7c" });

        for (const place of places_api_response_json.results) {
          const new_property = new Property({
            owner: user!._id,
            name: place.name,
            provider: "GOOGLE",
            type: "BOARDING_HOUSE",
            description:
              "Escape to comfort in our cozy retreat, where modern convenience meets homely charm. Enjoy fast, free Wi-Fi to stay connected, a fully-equipped kitchen area to whip up your favorite meals, and a convenient laundry area to keep everything fresh during your stay. Whether you're here for business or leisure, we've got all the essentials covered for a stress-free experience!",
            amenities: [
              "AIR_CONDITION",
              "KITCHEN_AREA",
              "LAUNDRY_AREA",
              "FREE_WATER",
              "FREE_WIFI",
            ],
            rooms: [],
            reviews: [],
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
            last_updated: new Date(),
          });
          await new_property.save({ session });

          if (place.photos) {
            const new_photo = await Photo.insertMany(
              place.photos.map((photo) => ({
                type: "PROPERTY",
                url: photo.photo_reference,
                height: photo.height,
                width: photo.width,
                property_id: null,
                last_updated: new Date(),
              })),
              { session }
            );
            new_property.photos.push(...new_photo.map((photo) => photo._id));
            await new_property.save({ session });
          }
        }

        while (next_page_token) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          const next_page_response = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${places_api_key}&pagetoken=${next_page_token}`
          );
          const next_page_response_json =
            (await next_page_response.json()) as GooglePlacesAPINearbyResponse;

          for (const place of next_page_response_json.results) {
            const new_property = new Property({
              owner: user?._id,
              name: place.name,
              provider: "GOOGLE",
              amenities: [
                "AIR_CONDITION",
                "KITCHEN_AREA",
                "LAUNDRY_AREA",
                "FREE_WATER",
                "FREE_WIFI",
              ],
              type: "BOARDING_HOUSE",
              description:
                "Escape to comfort in our cozy retreat, where modern convenience meets homely charm. Enjoy fast, free Wi-Fi to stay connected, a fully-equipped kitchen area to whip up your favorite meals, and a convenient laundry area to keep everything fresh during your stay. Whether you're here for business or leisure, we've got all the essentials covered for a stress-free experience!",
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
              last_updated: new Date(),
            });
            await new_property.save({ session });

            if (place.photos) {
              const new_photo = await Photo.insertMany(
                place.photos.map((photo) => ({
                  type: "PROPERTY",
                  url: photo.photo_reference,
                  height: photo.height,
                  width: photo.width,
                  property_id: null,
                  last_updated: new Date(),
                })),
                { session }
              );
              new_property.photos.push(...new_photo.map((photo) => photo._id));
              await new_property.save({ session });
            }

            next_page_token = next_page_response_json.next_page_token;
          }
        }
        await session.commitTransaction();
        await session.endSession();

        return reply.code(201).send(JSONResponse("CREATED", "property saved"));
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send(JSONResponse("BAD_REQUEST"));
      }
    }
  );

  //

  fastify.get<{
    Querystring: Record<"latitude" | "longitude", string>;
  }>("/nearby", async (request, reply) => {
    try {
      const { latitude, longitude } = request.query;

      const places_api_response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${places_api_key}&location=${latitude}%2C${longitude}&type=property&rankby=distance`
      );

      const places_api_response_json =
        (await places_api_response.json()) as GooglePlacesAPINearbyResponse;

      let next_page_token = places_api_response_json.next_page_token;

      const user = await User.findOne({ _id: "66ab0b4833f908410394cc7c" });

      let result = [];

      for (const place of places_api_response_json.results) {
        result.push({
          owner: null,
          name: place.name,
          type: "BOARDING_HOUSE",
          description: "",
          amenities: [],
          ratings: [],
          rooms: [],
          photos: place.photos
            ? place.photos.map((photo) => ({
                type: "PROPERTY",
                url: photo.photo_reference,
                height: photo.height,
                width: photo.width,
                property_id: null,
                last_updated: new Date(),
              }))
            : [],
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
          provider: "GOOGLE",
        });
      }

      while (next_page_token) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const next_page_response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${places_api_key}&pagetoken=${next_page_token}`
        );
        const next_page_response_json =
          (await next_page_response.json()) as GooglePlacesAPINearbyResponse;

        for (const place of next_page_response_json.results) {
          result.push({
            owner: null,
            name: place.name,
            type: "BOARDING_HOUSE",
            description: "",
            amenities: [],
            ratings: [],
            rooms: [],
            photos: place.photos
              ? place.photos.map((photo) => ({
                  type: "PROPERTY",
                  url: photo.photo_reference,
                  height: photo.height,
                  width: photo.width,
                  property_id: null,
                  last_updated: new Date(),
                }))
              : [],
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
            provider: "GOOGLE",
          });
          next_page_token = next_page_response_json.next_page_token;
        }
      }

      return reply
        .code(200)
        .send(JSONResponse("OK", "request successful", result));
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send(JSONResponse("INTERNAL_SERVER_ERROR"));
    }
  });
  done();
}
