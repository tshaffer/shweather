import { DailyForecastDay, GoogleGeometry } from "./googleInterfaces";

export interface FetchForecastResponse {
  days: DailyForecastDay[];
}

export interface ShWeatherLocation {
  googlePlaceId: string;
  geometry: GoogleGeometry;
  friendlyPlaceName: string;
}

