import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { DailyForecastDay, FetchForecastResponse, RecentLocation } from '../types';

interface ShweatherState {
  dailyForecasts: DailyForecastDay[];
  recentLocations: RecentLocation[];
}

const initialState: ShweatherState = {
  dailyForecasts: [],
  recentLocations: [],
};

export const fetchForecast = createAsyncThunk(
  'forecast/fetchForecast',
  async ({ location: locationCoordinates }: { location: google.maps.LatLngLiteral }) => {
    const response = await axios.get('/api/v1/forecast', {
      params: { location: JSON.stringify(locationCoordinates) },
    });
    return { days: response.data.days };
  }
);

const shweatherSlice = createSlice({
  name: 'shweather',
  initialState,
  reducers: {
    setDailyForecasts(state, action: PayloadAction<DailyForecastDay[]>) {
      state.dailyForecasts = action.payload;
    },
    setRecentLocations: (state, action: PayloadAction<RecentLocation[]>) => {
      state.recentLocations = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchForecast.fulfilled, (state, action: PayloadAction<any>) => {
        const fetchForecastResponse: FetchForecastResponse = action.payload;
        const { days: forecast } = fetchForecastResponse;

        for (const dailyForecast of forecast) {
            state.dailyForecasts.push(dailyForecast);
          }
        }
      );
  },
});

export const {
  setDailyForecasts,
  setRecentLocations,
} = shweatherSlice.actions;

export default shweatherSlice.reducer;

