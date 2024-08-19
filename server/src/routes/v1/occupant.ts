import { FastifyInstance, FastifyPluginOptions } from "fastify";
import Occupant, { OccupantType } from "../../database/model/Occupant";
import JSONResponse from "src/lib/json-response";
import User from "src/database/model/User";
import Room from "src/database/model/Room";

export default function occupant_v1_router(
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
  done: () => void
) {
  // create route

  fastify.post<{ Body: OccupantType }>("/", async (request, reply) => {
    try {
      const occupant = request.body;

      const found_user = await User.exists({ _id: occupant.user });

      if (!found_user)
        return reply
          .code(404)
          .send(JSONResponse("NOT_FOUND", "user does not exist"));

      const found_room = await Room.exists({ _id: occupant.room });

      if (!found_room)
        return reply
          .code(404)
          .send(JSONResponse("NOT_FOUND", "room does not exist"));

      const new_occupant = new Occupant({
        room: occupant.room,
        user: occupant.user,
      });

      await new_occupant.save();
      await Room.updateOne(
        { _id: occupant.room },
        {
          $push: { photos: new_occupant._id },
          $set: { last_updated: new Date() },
        }
      );

      return reply
        .code(201)
        .send(JSONResponse("CREATED", "new occupant created"));
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send(JSONResponse("INTERNAL_SERVER_ERROR"));
    }
  });
  // read route
  // update route

  // delete route

  done();
}
