import { FastifyInstance, FastifyPluginOptions } from "fastify";
import Property from "../../database/model/Property";
import Review, { ReviewType } from "../../database/model/Review";
import User from "../../database/model/User";
import JSONResponse from "../../lib/json-response";

export default function review_v1_router(
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
  done: () => void
) {
  // create route

  fastify.post<{ Body: ReviewType & { id: string } }>(
    "/",
    async (request, reply) => {
      try {
        const review = request.body;

        const found_user = await User.exists({ _id: review.reviewer });

        if (!found_user)
          return reply
            .code(404)
            .send(JSONResponse("NOT_FOUND", "user does not exist"));

        const found_property = await Property.exists({ _id: review.property });

        if (!found_property)
          return reply
            .code(404)
            .send(JSONResponse("NOT_FOUND", "property does not exist"));

        const found_review = await Review.findOne({
          reviewer: review.reviewer,
          property: review.property,
        });

        if (found_review)
          return reply
            .code(409)
            .send(
              JSONResponse(
                "CONFLICT",
                "A review already exist; One review per property. You can edit your existing review"
              )
            );

        const new_review = new Review({
          reviewer: review.reviewer,
          property: review.property,
          rate: review.rate,
          comment: review.comment,
          last_updated: new Date(),
        });

        await new_review.save();

        return reply.code(201).send(JSONResponse("CREATED", "review created"));
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
