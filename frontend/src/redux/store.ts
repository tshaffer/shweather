import { configureStore } from '@reduxjs/toolkit';
import shweatherReducer from './shweatherSlice';

export const store = configureStore({
  reducer: {
    shweather: shweatherReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
