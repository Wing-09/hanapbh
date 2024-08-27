import { FastifyInstance, FastifyPluginOptions } from "fastify";
import propertyV0Router from "./property";
import demoV0Router from "./demo";

export default function v0Router(
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
  done: () => void
) {
  fastify.register(propertyV0Router, { prefix: "/property" });
  fastify.register(demoV0Router, { prefix: "/demo" });
  done();
}
