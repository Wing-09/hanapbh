import Photo, { PhotoType } from "../../database/model/Photo";
import Lodging, { LodgingType } from "../../database/model/Lodging";
import { GooglePlacesAPINearbyResponse } from "../../lib/types/google-places-api-types";
import JSONResponse from "../../lib/json-response";
import databaseNearbyLodgings from "./lodging/database-nearby-lodging-query";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { startSession } from "mongoose";
import User from "../../database/model/User";

export default function lodging_v1_router(
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
  done: () => void
) {
  const places_api_key = process.env.GOOGLE_PLACES_API_KEY;
  if (!places_api_key)
    throw new Error("GOOGLE_PLACES_API_KEY is missing from your .env file");

  //create routes
  fastify.post<{ Body: Omit<LodgingType, "photos"> & { photos: PhotoType[] } }>(
    "/",
    async (request, reply) => {
      try {
        const session = await startSession();
        session.startTransaction();
        const { name, address, description, owner, type, location, photos } =
          request.body;

        const new_lodging = new Lodging({
          name,
          address,
          description,
          owner,
          type,
          location: {
            coordinates: location.coordinates,
          },
          last_updated: new Date(),
        });

        await new_lodging.save({ session });

        for (const photo of photos) {
          const new_photo = new Photo({
            type: "LODGING",
            lodging: new_lodging._id,
            url: photo.url,
            height: photo.height,
            width: photo.width,
            last_updated: new Date(),
          });
          await new_photo.save({ session });
          new_lodging.photos.push(new_photo._id);
        }

        await new_lodging.save({ session });

        await session.commitTransaction();
        await session.endSession();

        return reply
          .code(201)
          .send(
            JSONResponse("CREATED", "new lodging created", new_lodging.toJSON())
          );
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send(JSONResponse("BAD_REQUEST"));
      }
    }
  );
  fastify.post<{ Body: { latitude: number; longitude: number } }>(
    "/save",
    async (request, reply) => {
      try {
        const session = await startSession();
        session.startTransaction();

        const { latitude, longitude } = request.body;

        const places_api_response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${places_api_key}&location=${latitude}%2C${longitude}&type=lodging&rankby=distance`
        );

        const places_api_response_json =
          (await places_api_response.json()) as GooglePlacesAPINearbyResponse;

        let next_page_token = places_api_response_json.next_page_token;

        const user = await User.findOne({ _id: "66ab0b4833f908410394cc7c" });

        for (const place of places_api_response_json.results) {
          const new_lodging = new Lodging({
            owner: user!._id,
            name: place.name,
            description: "",
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
          await new_lodging.save({ session });

          if (place.photos) {
            const new_photo = await Photo.insertMany(
              place.photos.map((photo) => ({
                type: "LODGING",
                url: photo.photo_reference,
                height: photo.height,
                width: photo.width,
                lodging_id: null,
                last_updated: new Date(),
              })),
              { session }
            );
            new_lodging.photos.push(...new_photo.map((photo) => photo._id));
            await new_lodging.save({ session });
          }
        }

        while (next_page_token) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          console.log(next_page_token)
          const next_page_response = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${places_api_key}&pagetoken=${next_page_token}`
          );
          const next_page_response_json =
            (await next_page_response.json()) as GooglePlacesAPINearbyResponse;
          console.log(next_page_response_json);

          for (const place of next_page_response_json.results) {
            const new_lodging = new Lodging({
              owner: user?._id,
              name: place.name,
              description: "",
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
            await new_lodging.save({ session });

            if (place.photos) {
              const new_photo = await Photo.insertMany(
                place.photos.map((photo) => ({
                  type: "LODGING",
                  url: photo.photo_reference,
                  height: photo.height,
                  width: photo.width,
                  lodging_id: null,
                  last_updated: new Date(),
                })),
                { session }
              );
              new_lodging.photos.push(...new_photo.map((photo) => photo._id));
              await new_lodging.save({ session });
            }

            next_page_token = next_page_response_json.next_page_token;
          }
        }
        await session.commitTransaction();
        await session.endSession();

        return reply.code(201).send(JSONResponse("CREATED", "lodging saved"));
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send(JSONResponse("BAD_REQUEST"));
      }
    }
  );

  //read routes

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

        return reply.code(200).send(
          JSONResponse("OK", "request successful", {
            result: database_lodgings.sort((a, b) => a.distance - b.distance),
          })
        );
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send(JSONResponse("INTERNAL_SERVER_ERROR"));
      }
    }
  );

  //update routes

  fastify.patch<{
    Params: { key: keyof LodgingType };
    Body: Omit<LodgingType, "photos"> & { id: string; photos: PhotoType[] };
  }>("/:key", async (request, reply) => {
    try {
      const { key } = request.params;
      const { id, name, photos } = request.body;

      if (!id)
        return reply
          .code(400)
          .send(
            JSONResponse(
              "BAD_REQUEST",
              "id field is required on the request body"
            )
          );

      const found_lodging = await Lodging.exists({ _id: id });
      if (!found_lodging)
        return reply
          .code(404)
          .send(JSONResponse("NOT_FOUND", "lodging not found"));

      switch (key) {
        case "name": {
          if (!name)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "name field is required as a request body"
                )
              );
          await Lodging.updateOne(
            { _id: id },
            { $set: { name, last_updated: new Date() } }
          );
          break;
        }
        default:
          return reply
            .code(400)
            .send(
              JSONResponse(
                "BAD_REQUEST",
                "key of LodgingType is needed as request parameter"
              )
            );
      }

      const new_lodging = await Lodging.findOne({ _id: id }).populate([
        "photos",
        "rooms",
        "favored_by",
        "rated_by",
      ]);
      return reply
        .code(200)
        .send(JSONResponse("OK", "lodging updated", new_lodging!.toJSON()));
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send(JSONResponse("INTERNAL_SERVER_ERROR"));
    }
  });
  //delete routes
  done();
}
