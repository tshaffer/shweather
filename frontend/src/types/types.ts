import { DailyForecastDay, GoogleGeometry } from "./googleInterfaces";

export type ForecastView = 'daily' | 'hourly';

export interface FetchForecastResponse {
  days: DailyForecastDay[];
}

export interface ShWeatherLocation {
  googlePlaceId: string;
  geometry: GoogleGeometry;
  friendlyPlaceName: string;
}

