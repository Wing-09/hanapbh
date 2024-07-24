export type LocationType = {
  longitude: number;
  latitude: number;
};

export default function getDistance(
  location_1: LocationType,
  location_2: LocationType
) {
  const earth_radius_km = 6371;

  const latitude_radiance_1 = (Math.PI / 180) * Number(location_1.latitude);
  const latitude_radiance_2 = (Math.PI / 180) * Number(location_2.latitude);

  const latitude_distance =
    ((Number(location_2.latitude) - Number(location_1.latitude)) * Math.PI) /
    180;
  const longitude_distance =
    ((Number(location_2.longitude) - Number(location_1.longitude)) * Math.PI) /
    180;

  const a =
    Math.pow(Math.sin(latitude_distance / 2), 2) +
    Math.pow(Math.sin(longitude_distance / 2), 2) *
      Math.cos(latitude_radiance_1) *
      Math.cos(latitude_radiance_2);

  const c = 2 * Math.asin(Math.sqrt(a));

  const distance = earth_radius_km * c;

  return distance;
}
