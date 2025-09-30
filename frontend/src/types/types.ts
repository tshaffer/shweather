import { DailyForecastDay, ForecastHour, GoogleGeometry } from "./googleWeatherTypes";
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

export interface DailyForecastDetailsColumnWidths {
  humidity: number;
  uvIndex: number;
  sunrise: number;
  sunset: number;
}

export interface HourlyForecastDetailsColumnWidths {
  humidity: number;
  uvIndex: number;
}

export interface DailyForecastColumnWidths {
  date: number;
  temps: number;
  condition: number;
  precip: number;
  wind: number;
  toggle: number;
}

export interface HourlyForecastColumnWidths {
  timeOfDay: number; 
  temp: number; 
  condition: number; 
  precip: number;  
  wind: number; 
  toggle: number;
}