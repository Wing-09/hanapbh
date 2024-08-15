/**
 * Calculates the distance between two geographic locations in meters using the Haversine formula.
 *
 * @param {LocationType} location_1 - The first location with latitude and longitude.
 * @param {LocationType} location_2 - The second location with latitude and longitude.
 * @returns {number} The distance between the two locations in meters.
 *
 */

export type LocationType = {
  longitude: number;
  latitude: number;
};

export default function getDistance(
  location_1: LocationType,
  location_2: LocationType
) {
  const earth_radius_km = 6371;

  const latitude_radians_1 = (Math.PI / 180) * location_1.latitude;
  const latitude_radians_2 = (Math.PI / 180) * location_2.latitude;

  const latitude_distance =
    ((location_2.latitude - location_1.latitude) * Math.PI) / 180;
  const longitude_distance =
    ((location_2.longitude - location_1.longitude) * Math.PI) / 180;

  const a =
    Math.pow(Math.sin(latitude_distance / 2), 2) +
    Math.cos(latitude_radians_1) *
      Math.cos(latitude_radians_2) *
      Math.pow(Math.sin(longitude_distance / 2), 2);

  const c = 2 * Math.asin(Math.sqrt(a));

  const distance = earth_radius_km * c;

  return distance * 1000;
}
