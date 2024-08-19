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
  // update route
  // delete route
  done();
}
