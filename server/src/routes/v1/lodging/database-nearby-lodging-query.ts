import { Document, Types } from "mongoose";
import Lodging, { LodgingType } from "src/database/model/Lodging";
import getDistance from "src/lib/distance";

export default async function databaseNearbyLodgings({
  longitude,
  latitude,
  max_distance,
  skip,
}: Record<string, number>) {
  try {
    const database_lodgings = (await Lodging.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          distanceField: "distance",
          maxDistance: max_distance,
          spherical: true,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: 20,
      },
      {
        $lookup: {
          from: "Photo",
          as: "photos",
          localField: "photos",
          foreignField: "_id",
        },
      },
      {
        $unwind: {
          path: "$photos",
          preserveNullAndEmptyArrays: true,
        },
      },
    ])) as
      | (Document<unknown, {}, LodgingType> &
          LodgingType & {
            _id: Types.ObjectId;
          })[]
      | null;

    return database_lodgings!.map((l) => ({
      ...l.toJSON(),
      distance: getDistance(
        { latitude, longitude },
        {
          latitude: l.location.coordinates[1],
          longitude: l.location.coordinates[0],
        }
      ),
    }));
  } catch (error) {
    throw error;
  }
}
