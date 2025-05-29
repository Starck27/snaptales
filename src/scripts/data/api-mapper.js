import Map from "../utils/map";

export async function storyMapper(story) {
  const { lat, lon } = story;

  let placeName = "";

  if (lat !== null && lon !== null) {
    placeName = await Map.getPlaceNameByCoordinate(lat, lon);
  }

  return {
    ...story,
    placeName,
  };
}
