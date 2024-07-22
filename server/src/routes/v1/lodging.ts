import { Router } from "express";
import { Types } from "mongoose";
import Lodging, { LodgingType } from "src/database/model/Lodging";
import { Photo } from "src/database/model/Photo";
import JSONResponse from "src/lib/json-response";
import checkLocation from "src/lib/middleware/checklocation";
import { GooglePlacesAPINearbyResponse } from "src/lib/types/google-places-api-types";
import { isNumberObject } from "util/types";

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
      const { page, google_next_page, max_distance } = request.query;

      if (!page || !max_distance)
        return response
          .status(400)
          .json(
            JSONResponse(
              "BAD_REQUEST",
              "page and max_distance is required as a query parameters"
            )
          );

      if (!Number(page) || !Number(max_distance))
        return response
          .status(400)
          .json(  
            JSONResponse(
              "BAD_REQUEST",
              "page and max_distance value must be a number"
            )
          );

      const skip = 20 * Number(page);

      const database_lodgings = await Lodging.aggregate<LodgingType>([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            distanceField: "distance",
            maxDistance: Number(max_distance),
            spherical: true,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: 20,
        },
      ]);

      const database_lodgings_json: (Omit<LodgingType, "photos"> & {
        id: string;
        photos: Photo[];
        distance: number;
      })[] = [];

      //fetching nearby lodging using  google places api
      const places_api_response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${places_api_key}&location=${latitude}%2C${longitude}&type=lodging&rankby=distance`
      );

      const places_api_response_json =
        (await places_api_response.json()) as GooglePlacesAPINearbyResponse;

      const google_nearby_place: (Omit<LodgingType, "photos"> & {
        id: string;
        photos: Photo[];
        distance: number;
      })[] = [];

      for (const place of places_api_response_json.results) {
        google_nearby_place.push({
          id: place.place_id,
          name: place.name,
          description: "",
          photos: place.photos
            ? place.photos.map((photo) => ({
                type: "LODGING_PIC",
                id: "",
                url: photo.photo_reference,
                height: photo.height,
                width: photo.width,
                lodging_id: null,
                date_created: new Date(),
                last_updated: new Date(),
              }))
            : [],
          offers: [],
          favored: [],
          ratings: [],
          rooms: [],
          location: {
            type: "Point",
            coordinates: [
              place.geometry.location.lng,
              place.geometry.location.lat,
            ],
          },
          address: {
            street: "",
            barangay: "",
            municipality_city: "",
            province: "",
          },
          distance: 0,
          date_created: new Date(),
          last_updated: new Date(),
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
