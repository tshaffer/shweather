import express from 'express';
import { getDailyForecast, getHourlyForecast, getVersion } from '../controllers';

export const createRoutes = (app: express.Application) => {

  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });

  app.get('/api/v1/version', getVersion);

  app.get('/api/v1/dailyForecast', getDailyForecast);
  app.get('/api/v1/hourlyForecast', getHourlyForecast);

};
