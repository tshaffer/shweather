// shweatherSelectors.ts
import { DailyForecastDay, ShWeatherLocation } from '../types';
import { RootState } from './store';

// Base state selectors
export const selectShweatherState = (state: RootState) => state.shweather;

// Misc selectors
export const selectForecastView = (state: RootState): 'daily' | 'hourly' => state.shweather.forecastView || 'daily';
export const selectDailyForecasts = (state: RootState): DailyForecastDay[] => (state.shweather).dailyForecasts;
export const selectRecentLocations = (state: RootState): ShWeatherLocation[] => state.shweather.recentLocations;
export const selectLastLocation = (state: RootState): ShWeatherLocation | null => state.shweather.lastLocation;