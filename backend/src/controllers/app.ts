import { Request, Response } from 'express';

import { version } from '../version';
import { getDailyForecast } from '../utilities';
import { DailyForecastDay } from 'googleInterfaces';

export const getVersion = (request: Request, response: Response, next: any) => {
  const data: any = {
    serverVersion: version,
  };
  response.json(data);
};

export const getForecast = async (request: Request, response: Response, next: any) => {
  console.log('getForecast called with query:', request.query);
  const { location, date } = request.query as { location: string, date: string };
  const googleLocation = JSON.parse(location) as { lat: number; lng: number };
  console.log('Parsed location:', googleLocation);

  const days: DailyForecastDay[] = await getDailyForecast(googleLocation.lat, googleLocation.lng, 10);
  console.log('Forecast days:', days);

  return response.json({
    days,
  });
}

