import { Request, Response } from 'express';

import { version } from '../version';
import { getDayForecasts, getHourForecasts } from '../utilities';
import { ForecastDay, ForecastHour } from 'googleInterfaces';

export const getVersion = (request: Request, response: Response, next: any) => {
  const data: any = {
    serverVersion: version,
  };
  response.json(data);
};

export const getDailyForecast = async (request: Request, response: Response, next: any) => {
  console.log('getDailyForecast called with query:', request.query);
  const { location, date } = request.query as { location: string, date: string };
  const googleLocation = JSON.parse(location) as { lat: number; lng: number };
  console.log('Parsed location:', googleLocation);

  const days: ForecastDay[] = await getDayForecasts(googleLocation.lat, googleLocation.lng, 10);
  console.log('Forecast days:', days);

  return response.json({
    days,
  });
}

export const getHourlyForecast = async (request: Request, response: Response, next: any) => {
  console.log('getHourlyForecast called with query:', request.query);
  const { location, date } = request.query as { location: string, date: string };
  const googleLocation = JSON.parse(location) as { lat: number; lng: number };
  console.log('Parsed location:', googleLocation);

  const hours: ForecastHour[] = await getHourForecasts(googleLocation.lat, googleLocation.lng, 72);
  console.log('Forecast hours:', hours);

  return response.json({
    hours,
  });
}

