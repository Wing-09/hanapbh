import Photo, { PhotoType } from "../../database/model/Photo";
import Property, { PropertyType } from "../../database/model/Property";
import JSONResponse from "../../lib/json-response";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { Document, startSession, Types } from "mongoose";
import getDistance from "../../lib/distance";
import exclude from "../../lib/exclude";

export default function property_v1_router(
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
  done: () => void
) {
  //create routes
  fastify.post<{
    Body: Omit<PropertyType, "photos"> & { photos: PhotoType[] };
  }>("/", async (request, reply) => {
    try {
      const session = await startSession();
      session.startTransaction();
      const { name, address, description, owner, type, location, photos } =
        request.body;

      const new_property = new Property({
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

      await new_property.save({ session });

      for (const photo of photos) {
        const new_photo = new Photo({
          type: "property",
          property: new_property._id,
          url: photo.url,
          height: photo.height,
          width: photo.width,
          last_updated: new Date(),
        });
        await new_photo.save({ session });
        new_property.photos.push(new_photo._id);
      }

      await new_property.save({ session });

      await session.commitTransaction();
      await session.endSession();

      return reply
        .code(201)
        .send(
          JSONResponse("CREATED", "new property created", new_property.toJSON())
        );
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send(JSONResponse("BAD_REQUEST"));
    }
  });

  //read routes

  fastify.get<{ Querystring: Record<string, string> }>(
    "/nearby",
    async (request, reply) => {
      try {
        const { latitude, longitude } = request.query;
        const { page, max_distance } = request.query;

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

        const database_properties = (await Property.aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [Number(longitude), Number(latitude)],
              },
              distanceField: "distance",
              maxDistance: Number(max_distance),
              spherical: true,
            },
          },
          {
            $skip: skip,
          },
          {
            $limit: 20,
          },
          {
            $lookup: {
              from: "photos",
              as: "photos",
              localField: "photos",
              foreignField: "_id",
            },
          },
        ])) as
          | (Document<unknown, {}, PropertyType> &
              PropertyType & {
                _id: Types.ObjectId;
              })[]
          | null;

        return reply.code(200).send(
          JSONResponse(
            "OK",
            "request successful",
            database_properties
              ? database_properties.map((l) => ({
                  ...exclude({ id: l._id, ...l }, ["_id"]),
                  distance: getDistance(
                    {
                      latitude: Number(latitude),
                      longitude: Number(longitude),
                    },
                    {
                      latitude: l.location.coordinates[1],
                      longitude: l.location.coordinates[0],
                    }
                  ),
                }))
              : []
          )
        );
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send(JSONResponse("INTERNAL_SERVER_ERROR"));
      }
    }
  );

  //update routes

  fastify.patch<{
    Params: { key: keyof PropertyType };
    Body: Omit<PropertyType, "photos"> & {
      id: string;
      photos: (PhotoType & { id: string })[];
    };
  }>("/:key", async (request, reply) => {
    try {
      const { key } = request.params;
      const {
        id,
        name,
        photos,
        address,
        location,
        amenities,
        description,
        type,
      } = request.body;

      if (!id)
        return reply
          .code(400)
          .send(
            JSONResponse(
              "BAD_REQUEST",
              "id field is required on the request body"
            )
          );

      const found_property = await Property.exists({ _id: id });
      if (!found_property)
        return reply
          .code(404)
          .send(JSONResponse("NOT_FOUND", "property not found"));

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
          await Property.updateOne(
            { _id: id },
            { $set: { name, last_updated: new Date() } }
          );
          break;
        }
        case "address": {
          if (!address) {
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "address field is required on the request body"
                )
              );
          }

          if (
            !address.barangay ||
            !address.municipality_city ||
            !address.province ||
            !address.street ||
            !address.vicinity
          ) {
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "barangay, municipality_city, province, street, and vicinity field is required on the address"
                )
              );
          }

          await Property.updateOne(
            { _id: id },
            { $set: { address, last_updated: new Date() } }
          );

          break;
        }
        case "location": {
          if (!location)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "location field is required on the request body"
                )
              );

          if (!location.coordinates)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "coordinates field with value [longitude, latitude] is required on location"
                )
              );
          await Property.updateOne(
            { _id: id },
            { $set: { location, last_updated: new Date() } }
          );
          break;
        }
        case "amenities": {
          if (!amenities)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "amenities field is required on request body"
                )
              );
          await Property.updateOne(
            { _id: id },
            { $set: { amenities, last_updated: new Date() } }
          );
          break;
        }
        case "type": {
          if (!type)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "type field is required on the request body"
                )
              );

          await Property.updateOne(
            { _id: id },
            { $set: { type, last_updated: new Date() } }
          );
          break;
        }
        case "photos": {
          if (!photos)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "photos field is required on the request body"
                )
              );

          let new_photos = [];
          for (const photo of photos) {
            const found_photo = await Photo.exists({ _id: photo.id });
            if (found_photo) continue;
            new_photos.push(
              new Photo({
                type: "PROPERTY",
                url: photo.url,
                property: found_property._id,
                width: photo.width,
                height: photo.height,
                last_updated: new Date(),
              })
            );
          }

          await Property.updateOne(
            { _id: id },
            {
              $push: {
                photos: { $each: new_photos.map((photo) => photo._id) },
              },
              $set: { last_updated: new Date() },
            }
          );
          break;
        }
        case "description": {
          if (!description)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "description field is required on request body"
                )
              );

          await Property.updateOne(
            { _id: id },
            { $set: { description, last_updated: new Date() } }
          );
          break;
        }

        default:
          return reply
            .code(400)
            .send(
              JSONResponse(
                "BAD_REQUEST",
                "key of propertyType is needed as request parameter"
              )
            );
      }

      const new_property = await Property.findOne({ _id: id }).populate([
        "photos",
        "rooms",
        "favored_by",
        "rated_by",
      ]);
      return reply
        .code(200)
        .send(JSONResponse("OK", "property updated", new_property!.toJSON()));
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send(JSONResponse("INTERNAL_SERVER_ERROR"));
    }
  });
  //delete routes
  done();
}
