import { NextFunction, Request, Response } from "express";
import JSONResponse from "../json-response";

type GoogleGeocodeAPIResponse = {
  results: [
    {
      formatted_address: string;
    }
  ];
};

export default async function checkLocation(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const geocode_api_key = process.env.GOOGLE_GEOCODE_API_KEY;
  if (!geocode_api_key)
    throw new Error("GOOGLE_GEOCODE_API_KEY is missing from your .env file");

  try {
    const { longitude, latitude } = request.query;

    if (!longitude || !latitude)
      return response
        .status(400)
        .json(
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
      return response
        .status(403)
        .json(
          JSONResponse(
            "FORBIDDEN",
            "the server only accepts request from the philippines"
          )
        );

    next();
  } catch (error) {
    console.error(error);
    return response.status(500).json(JSONResponse("INTERNAL_SERVER_ERROR"));
  }
}
