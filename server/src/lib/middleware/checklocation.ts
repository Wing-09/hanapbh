import JSONResponse from "../json-response";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";

type GoogleGeocodeAPIResponse = {
  results: [
    {
      formatted_address: string;
    }
  ];
};

const fastify = Fastify();

export default async function checkLocation(
  request: FastifyRequest<{
    Querystring: { longitude: string; latitude: string };
  }>,
  reply: FastifyReply
) {
  const geocode_api_key = process.env.GOOGLE_GEOCODE_API_KEY;
  if (!geocode_api_key)
    throw new Error("GOOGLE_GEOCODE_API_KEY is missing from your .env file");

  try {
    const { longitude, latitude } = request.query;

    if (!longitude || !latitude)
      return reply
        .code(400)
        .send(
          JSONResponse(
            "BAD_REQUEST",
            "latitude and latitude is required as a query parameter"
          )
        );

    const geolocation_response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?key=${geocode_api_key}&latlng=${latitude},${longitude}&result_type=country`
    );
    const geolocation_response_json =
      (await geolocation_response.json()) as GoogleGeocodeAPIResponse;
    if (
      geolocation_response_json.results[0].formatted_address.toLocaleLowerCase() !==
      "philippines"
    )
      return reply
        .code(403)
        .send(
          JSONResponse(
            "FORBIDDEN",
            "the server only accepts request from the philippines"
          )
        );
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send(JSONResponse("INTERNAL_SERVER_ERROR"));
  }
}
