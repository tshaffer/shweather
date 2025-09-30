import { DailyForecastDay, ForecastHour, GoogleGeometry } from "./googleInterfaces";
import { WbSunny as SunnyIcon } from "@mui/icons-material";

export type ForecastView = 'daily' | 'hourly';

export interface ForecastDaysResponse {
  days: DailyForecastDay[];
}

export interface ForecastHoursResponse {
  hours: ForecastHour[];
  timeZone?: { id: string };
  nextPageToken?: string;
}

export interface ShWeatherLocation {
  googlePlaceId: string;
  geometry: GoogleGeometry;
  friendlyPlaceName: string;
}

export type ConditionView = {
  label: string;
  iconUrl?: string;                 // from Google
  FallbackIcon: typeof SunnyIcon;   // MUI fallback
};

export const fmtPct = (n?: number) => (typeof n === "number" ? `${n}%` : "—");
