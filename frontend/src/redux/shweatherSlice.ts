import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { DailyForecastDay, FetchForecastResponse, ShWeatherLocation } from '../types';

interface ShweatherState {
  forecastView?: 'daily' | 'hourly'; // NEW
  dailyForecasts: DailyForecastDay[];
  lastLocation: ShWeatherLocation | null;
  recentLocations: ShWeatherLocation[];
}

const initialState: ShweatherState = {
  forecastView: 'daily', // NEW
  dailyForecasts: [],
  lastLocation: null,
  recentLocations: [],
};

export const fetchDailyForecast = createAsyncThunk(
  'forecast/fetchForecast',
  async ({ location: locationCoordinates }: { location: google.maps.LatLngLiteral }) => {
    const response = await axios.get('/api/v1/dailyForecast', {
      params: { location: JSON.stringify(locationCoordinates) },
    });
    return { days: response.data.days };
  }
);

function isBeforeToday(displayDate: { year: number; month: number; day: number }): boolean {
  // Build a local Date for the forecast day
  const forecastDate = new Date(displayDate.year, displayDate.month - 1, displayDate.day);
  // Today's local midnight
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return forecastDate < todayStart;
}

const shweatherSlice = createSlice({
  name: 'shweather',
  initialState,
  reducers: {
    setForecastView: (state, action: PayloadAction<'daily' | 'hourly'>) => {
      state.forecastView = action.payload;
    },
    setRecentLocations: (state, action: PayloadAction<ShWeatherLocation[]>) => {
      state.recentLocations = action.payload;
    },
    setLastLocation: (state, action: PayloadAction<ShWeatherLocation | null>) => {
      state.lastLocation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyForecast.fulfilled, (state, action: PayloadAction<any>) => {
        const fetchForecastResponse: FetchForecastResponse = action.payload;
        const { days: forecast } = fetchForecastResponse;
        state.dailyForecasts = forecast.filter(d => !isBeforeToday(d.displayDate));
      });
  },
});

export const {
  setForecastView,
  setRecentLocations,
  setLastLocation,
} = shweatherSlice.actions;

export default shweatherSlice.reducer;

