import { FastifyInstance, FastifyPluginOptions } from "fastify";
import Property from "../../database/model/Property";
import getDistance from "../../lib/distance";
import exclude from "../../lib/exclude";
import JSONResponse from "../../lib/json-response";

export default function demoV0Router(
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
  done: () => void
) {
  fastify.get<{
    Querystring: Record<"latitude" | "longitude" | "page", string>;
  }>("/", async (request, reply) => {
    try {
      const { page, latitude, longitude } = request.query;

      if (!page)
        return reply
          .code(400)
          .send(
            JSONResponse(
              "BAD_REQUEST",
              "page is required as a query parameters"
            )
          );

      if (!Number(page))
        return reply
          .code(400)
          .send(JSONResponse("BAD_REQUEST", "page value must be a number"));

      const skip = 20 * (Number(page) - 1);

      const properties = await Property.find()
        .skip(skip)
        .limit(20)
        .populate("photos");

      return reply.code(200).send(
        JSONResponse(
          "OK",
          "request successful",
          properties
            ? properties.map((l) => ({
                ...exclude({ id: l._id, ...l.toJSON() }, ["_id"]),
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
  });
  done();
}
