import { Lodging, Photo } from "@prisma/client";
import { Router } from "express";
import JSONResponse from "src/lib/json-response";
import checkLocation from "src/lib/middleware/checklocation";
import { GooglePlacesAPINearbyResponse } from "src/lib/types/google-places-api-types";

const router = Router();
const places_api_key = process.env.GOOGLE_PLACES_API_KEY;
if (!places_api_key)
  throw new Error("GOOGLE_PLACES_API_KEY is missing from your .env file");

router

  //create route

  //read route
  .get("/nearby", checkLocation, async (request, response) => {
    try {
      const { latitude, longitude } = request.query;

      //fetching nearby lodging using  google places api
      const places_api_response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${places_api_key}&location=${latitude}%2C${longitude}&type=lodging&rankby=distance`
      );

      const places_api_response_json =
        (await places_api_response.json()) as GooglePlacesAPINearbyResponse;

      const google_nearby_place: (Lodging & { photos: Photo[] })[] = [];

      for (const place of places_api_response_json.results) {
        google_nearby_place.push({
          id: place.place_id,
          owner_id: "",
          name: place.name,
          description: "",
          photos: place.photos.map((photo) => ({
            id: "",
            url: photo.photo_reference,
            height: photo.height,
            width: photo.width,
            date_created: null,
            lodging_id: null,
            room_id: null,
            user_id: null,
          })),
          offers: [],
          type: null,
          date_created: null,
        });
      }

      
    } catch (error) {
      console.error(error);
      return response.status(500).json(JSONResponse("INTERNAL_SERVER_ERROR"));
    }
  });
//update route
//delete route

const lodging_v1_router = router;

export default lodging_v1_router;
