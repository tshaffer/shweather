// shweatherSelectors.ts
import { RootState } from './store';

// Base state selectors
export const selectShweatherState = (state: RootState) => state.shweather;

// Misc selectors
export const selectDailyForecasts = (state: RootState) => state.shweather.dailyForecasts;
export const selectRecentLocations = (state: RootState) => state.shweather.recentLocations;
