import dotenv from 'dotenv';
dotenv.config();
console.log('Environment variables loaded from .env file in googleWeather.ts');
console.log('GOOGLE_MAPS_API_KEY:', process.env.GOOGLE_MAPS_API_KEY ? '***' : 'MISSING');

import axios from "axios";
import { ForecastDay, ForecastDaysResponse, ForecastHoursResponse } from "googleInterfaces";
import { ForecastHour } from "googleInterfaces";

const DAILY_FORECAST_BASE = "https://weather.googleapis.com/v1/forecast/days:lookup";

/**
 * Fetch up to `days` of daily forecasts (max 10).
 * Handles pagination via pageSize + nextPageToken.
 */
export async function getDayForecasts(
  lat: number,
  lng: number,
  days = 10,
  pageSize = 5
): Promise<ForecastDay[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error("Missing GOOGLE_MAPS_API_KEY");

  let out: ForecastDay[] = [];
  let pageToken: string | undefined;

  do {
    const params: Record<string, string | number> = {
      key: apiKey,
      "location.latitude": lat,
      "location.longitude": lng,
      days,
      pageSize,
    };
    if (pageToken) params.pageToken = pageToken;

    const { data } = await axios.get<ForecastDaysResponse>(DAILY_FORECAST_BASE, { params });
    out = out.concat(data.forecastDays ?? []);
    pageToken = data.nextPageToken;
  } while (pageToken && out.length < days);

  return out.slice(0, days);
}

export async function getHourForecasts(
  lat: number,
  lng: number,
  hours = 240,
  pageSize = 5
): Promise<ForecastHour[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error("Missing GOOGLE_MAPS_API_KEY");

  let out: ForecastHour[] = [];
  let pageToken: string | undefined;

  do {
    const params: Record<string, string | number> = {
      key: apiKey,
      "location.latitude": lat,
      "location.longitude": lng,
      hours,
      pageSize,
    };
    if (pageToken) params.pageToken = pageToken;

    const { data } = await axios.get<ForecastHoursResponse>(DAILY_FORECAST_BASE, { params });
    out = out.concat(data.forecastHours ?? []);
    pageToken = data.nextPageToken;
  } while (pageToken && out.length < hours);

  return out.slice(0, hours);
}
