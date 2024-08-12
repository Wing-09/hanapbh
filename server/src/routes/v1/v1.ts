import user_v1_router from "./user";
import otp_v1_router from "./otp";
import lodging_v1_router from "./property";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

export default function v1_router(
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
  done: () => void
) {
  fastify.register(user_v1_router, { prefix: "/user" });
  fastify.register(otp_v1_router, { prefix: "/otp" });
  fastify.register(lodging_v1_router, { prefix: "/lodging" });
  done();
}
