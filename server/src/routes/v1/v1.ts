import userV1Router from "./user";
import otpV1Router from "./otp";
import propertyV1Router from "./property";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

export default function v1Router(
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
  done: () => void
) {
  fastify.register(userV1Router, { prefix: "/user" });
  fastify.register(otpV1Router, { prefix: "/otp" });
  fastify.register(propertyV1Router, { prefix: "/property" });
  done();
}
