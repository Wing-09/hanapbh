import { FastifyInstance, FastifyPluginOptions } from "fastify";
import Room, { RoomType } from "../../database/model/Room";
import JSONResponse from "../../lib/json-response";
import Property from "src/database/model/Property";
import Photo, { PhotoType } from "src/database/model/Photo";
import { startSession } from "mongoose";

export default function room_v1_router(
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
  done: () => void
) {
  // create route

  fastify.post<{ Body: Omit<RoomType, "photos"> & { photos: PhotoType[] } }>(
    "/",
    async (request, reply) => {
      try {
        const room = request.body;

        const session = await startSession();
        session.startTransaction();
        if (!room.property)
          return reply
            .code(400)
            .send(
              JSONResponse(
                "BAD_REQUEST",
                "property field is required on the request body"
              )
            );

        const found_property = await Property.findOne({ _id: room.property });

        if (!found_property)
          return reply
            .code(400)
            .send(JSONResponse("NOT_FOUND", "user does not exist"));

        const new_room = new Room({
          property: room.property,
          bed_count: room.bed_count,
          description: room.description,
          occupants: {
            max: room.occupants.max,
          },
          price: {
            type: room.price.type,
            amount: room.price.amount,
            per_time: room.price.per_time,
          },
          last_updated: new Date(),
        });

        await new_room.save({ session });

        for (const photo of room.photos) {
          const new_photo = new Photo({
            type: "PROPERTY",
            room: new_room._id,
            url: photo.url,
            width: photo.width,
            height: photo.height,
            last_updated: new Date(),
          });

          await new_photo.save({ session });

          new_room.photos.push(new_photo._id);
        }

        await new_room.save({ session });

        await session.commitTransaction();
        await session.endSession();

        return reply
          .code(201)
          .send(JSONResponse("CREATED", "new room created"));
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send(JSONResponse("INTERNAL_SERVER_ERROR"));
      }
    }
  );
  // read route

  fastify.get<{ Params: { id: string } }>(
    "/room/:id",
    async (request, reply) => {
      try {
        const { id } = request.params;

        const found_room = await Room.findOne({ _id: id }).populate([
          "photos",
          "occupants.in",
          "occupants.out",
        ]);

        if (!found_room)
          return reply
            .code(404)
            .send(JSONResponse("NOT_FOUND", "room not found"));

        return reply
          .code(200)
          .send(JSONResponse("OK", "request successful", found_room.toJSON()));
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send(JSONResponse("INTERNAL_SERVER_ERROR"));
      }
    }
  );
  // update route
  fastify.patch<{
    Params: { key: keyof RoomType };
    Body: Omit<RoomType, "photos"> & {
      photos: (PhotoType & { id: string })[];
      id: string;
    };
  }>("/:key", async (request, reply) => {
    try {
      const { key } = request.params;
      const room = request.body;

      const found_room = await Room.findOne({ _id: room.id });

      if (!found_room)
        return reply
          .code(404)
          .send(JSONResponse("NOT_FOUND", "room does not exist"));

      switch (key) {
        case "bed_count": {
          if (!room.bed_count)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "bed_count field is required on the request body"
                )
              );

          await Room.updateOne(
            { _id: room.id },
            { $set: { bed_count: room.bed_count, last_updated: new Date() } }
          );

          break;
        }
        case "description": {
          if (!room.description)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "description field is required on the request body"
                )
              );
          await Room.updateOne(
            { _id: room.id },
            {
              $set: { description: room.description, last_updated: new Date() },
            }
          );

          break;
        }
        case "price": {
          if (!room.price)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "price field is required on the request body"
                )
              );
          await Room.updateOne(
            { _id: room.id },
            { $set: { price: room.price, last_updated: new Date() } }
          );

          break;
        }
        case "photos": {
          if (!room.bed_count)
            return reply
              .code(400)
              .send(
                JSONResponse(
                  "BAD_REQUEST",
                  "bed_count field is required on the request body"
                )
              );

          let new_photos = [];
          for (const photo of room.photos) {
            const found_photo = await Photo.exists({ _id: photo.id });
            if (found_photo) continue;
            new_photos.push(
              new Photo({
                type: "ROOM",
                url: photo.url,
                room: found_room._id,
                width: photo.width,
                height: photo.height,
                last_updated: new Date(),
              })
            );
          }

          await Room.updateOne(
            { _id: found_room._id },
            {
              $push: {
                photos: { $each: new_photos.map((photo) => photo._id) },
              },
              $set: { last_updated: new Date() },
            }
          );

          break;
        }
        default:
          return reply
            .code(400)
            .send(
              JSONResponse(
                "BAD_REQUEST",
                "key of object Room is required as a request parameter"
              )
            );
      }

      const updated_room = await Room.findOne({ _id: room.id }).populate(
        "photos"
      );

      return reply
        .code(200)
        .send(
          JSONResponse(
            "OK",
            "room's " + key + " is updated",
            updated_room?.toJSON()
          )
        );
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send(JSONResponse("INTERNAL_SERVER_ERROR"));
    }
  });

  // delete route
  done();
}
