import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { DailyForecastDay, FetchForecastResponse, Forecast } from '../types';

export const fetchForecast = createAsyncThunk(
  'forecast/fetchForecast',
  async ({ location: locationCoordinates, date, index }: { location: google.maps.LatLngLiteral; date: string; index: number }) => {
    const response = await axios.get('/api/v1/forecast', {
      params: { location: JSON.stringify(locationCoordinates), date },
    });
    return { days: response.data.days, date, index };
  }
);

const initialState: Forecast = {
  dailyForecasts: [],
};

const forecastSlice = createSlice({
  name: 'forecast',
  initialState,
  reducers: {
    setDailyForecasts(state, action: PayloadAction<DailyForecastDay[]>) {
      state.dailyForecasts = action.payload;
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
} = forecastSlice.actions;

export default forecastSlice.reducer;

