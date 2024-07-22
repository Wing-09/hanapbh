export default function getDistance(
  location_1: [number, number],
  location_2: [number, number]
) {
  const earth_radius_km = 6371;

  const latitude_radiance_1 = (Math.PI / 180) * Number(location_1[1]);
  const latitude_radiance_2 = (Math.PI / 180) * Number(location_2[1]);

  const latitude_distance =
    ((Number(location_2[1]) - Number(location_1[1])) * Math.PI) / 180;
  const longitude_distance =
    ((Number(location_2[0]) - Number(location_1[0])) * Math.PI) / 180;

  const a =
    Math.pow(Math.sin(latitude_distance / 2), 2) +
    Math.pow(Math.sin(longitude_distance / 2), 2) *
      Math.cos(latitude_radiance_1) *
      Math.cos(latitude_radiance_2);

  const c = 2 * Math.asin(Math.sqrt(a));

  const distance = earth_radius_km * c;

  return distance;
}
