import { FastifyInstance, FastifyPluginOptions } from "fastify";
import propertyV0Router from "./property";

export default function v0Router(
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
  done: () => void
) {
  fastify.register(propertyV0Router, { prefix: "/property" });
  done();
}
