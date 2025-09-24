import { DailyForecastDay, ForecastHour, GoogleGeometry } from "./googleInterfaces";

export type ForecastView = 'daily' | 'hourly';

export interface ForecastDaysResponse {
  days: DailyForecastDay[];
}

export interface ForecastHoursResponse {
  forecastHours: ForecastHour[];
  timeZone?: { id: string };
  nextPageToken?: string;
}

export interface ShWeatherLocation {
  googlePlaceId: string;
  geometry: GoogleGeometry;
  friendlyPlaceName: string;
}

