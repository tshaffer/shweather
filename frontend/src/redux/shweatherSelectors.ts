// shweatherSelectors.ts
import { DailyForecastDay, ForecastHour, ShWeatherLocation } from '../types';
import { RootState } from './store';

// Base state selectors
export const selectShweatherState = (state: RootState) => state.shweather;

// Misc selectors
export const selectForecastView = (state: RootState): 'daily' | 'hourly' => state.shweather.forecastView || 'daily';
export const selectDailyForecasts = (state: RootState): DailyForecastDay[] => (state.shweather).dailyForecasts;
export const selectHourlyForecasts = (state: RootState): ForecastHour[] => (state.shweather).hourlyForecasts;
export const selectRecentLocations = (state: RootState): ShWeatherLocation[] => state.shweather.recentLocations;
export const selectLastLocation = (state: RootState): ShWeatherLocation | null => state.shweather.lastLocation;

export const selectIsLoadingDaily = (state: RootState) =>
  state.shweather.isLoadingDaily;

export const selectIsLoadingHourly = (state: RootState) =>
  state.shweather.isLoadingHourly;

export const selectIsLoadingForecast = (state: RootState) => {
  const view = state.shweather.forecastView;
  return view === 'hourly'
    ? state.shweather.isLoadingHourly
    : state.shweather.isLoadingDaily;
};
