import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { DailyForecastDay, ForecastDaysResponse, ForecastHour, ForecastHoursResponse, ShWeatherLocation } from '../types';

interface ShWeatherState {
  forecastView?: 'daily' | 'hourly';
  dailyForecasts: DailyForecastDay[];
  hourlyForecasts: ForecastHour[];
  lastLocation: ShWeatherLocation | null;
  recentLocations: ShWeatherLocation[];
  isLoadingDaily: boolean;
  isLoadingHourly: boolean;
}

const initialState: ShWeatherState = {
  forecastView: 'daily',
  dailyForecasts: [],
  hourlyForecasts: [],
  lastLocation: null,
  recentLocations: [],
  isLoadingDaily: false,
  isLoadingHourly: false,
};

export const fetchDailyForecast = createAsyncThunk(
  'forecast/fetchDailyForecast',
  async ({ location: locationCoordinates }: { location: google.maps.LatLngLiteral }) => {
    const response = await axios.get('/api/v1/dailyForecast', {
      params: { location: JSON.stringify(locationCoordinates) },
    });
    return { days: response.data.days };
  }
);

export const fetchHourlyForecast = createAsyncThunk(
  'forecast/fetchHourlyForecast',
  async ({ location: locationCoordinates }: { location: google.maps.LatLngLiteral }) => {
    const response = await axios.get('/api/v1/hourlyForecast', {
      params: { location: JSON.stringify(locationCoordinates) },
    });
    return { hours: response.data.hours };
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
      .addCase(fetchDailyForecast.pending, (state) => {
        state.isLoadingDaily = true;
      })
      .addCase(fetchDailyForecast.fulfilled, (state, action) => {
        state.isLoadingDaily = false;
        const { days } = action.payload as ForecastDaysResponse; // keep your current assignment
        state.dailyForecasts = days;
      })
      .addCase(fetchDailyForecast.rejected, (state) => {
        state.isLoadingDaily = false;
      })
      .addCase(fetchHourlyForecast.pending, (state) => {
        state.isLoadingHourly = true;
      })
      .addCase(fetchHourlyForecast.fulfilled, (state, action) => {
        state.isLoadingHourly = false;
        const { hours } = action.payload as ForecastHoursResponse; // keep your current assignment
        state.hourlyForecasts = hours;
      })
      .addCase(fetchHourlyForecast.rejected, (state) => {
        state.isLoadingHourly = false;
      });
  },
});

export const {
  setForecastView,
  setRecentLocations,
  setLastLocation,
} = shweatherSlice.actions;

export default shweatherSlice.reducer;

