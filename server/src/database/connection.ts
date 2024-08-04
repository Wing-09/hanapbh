import mongoose from "mongoose";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

export default async function mongoDBConnection(
  fastify: FastifyInstance,
  _: FastifyPluginOptions
) {
  try {
    const mongodb_uri = process.env.MONGODB_URI;
    if (!mongodb_uri)
      throw new Error("MONGODB_URI is missing from the .env file");

    //connect to mongodb
    await mongoose.connect(mongodb_uri);

    fastify.log.info("connected to db");
  } catch (error) {
    fastify.log.error(error);
    throw error;
  }
}
