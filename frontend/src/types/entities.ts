import { DailyForecastDay } from "./googleInterfaces";

export interface FetchForecastResponse {
  days: DailyForecastDay[];
}

export interface RecentLocation {
  label: string; // e.g., 'Bend, OR'
  lat: number;   // latitude
  lng: number;   // longitude
}
