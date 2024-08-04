import mongoose from "mongoose";
import { FastifyInstance } from "fastify";

export default async function mongoDBConnection(fastify: FastifyInstance) {
  const mongodb_uri = process.env.MONGODB_URI;
  if (!mongodb_uri)
    throw new Error("MONGODB_URI is missing from the .env file");

  try {
    //connect to mongodb
    await mongoose.connect(mongodb_uri);
    fastify.log.info("connected to db");
  } catch (error) {
    fastify.log.error(error);
    throw error;
  }
}
