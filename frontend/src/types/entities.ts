import { DailyForecastDay } from "./googleInterfaces";

export interface Forecast {
  dailyForecasts: DailyForecastDay[];
}

export interface FetchForecastResponse {
  days: DailyForecastDay[];
}
