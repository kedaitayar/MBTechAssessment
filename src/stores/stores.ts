import {configureStore} from '@reduxjs/toolkit';
import {googleMapsApi} from './services/googleMapsApi';

export const store = configureStore({
  reducer: {
    [googleMapsApi.reducerPath]: googleMapsApi.reducer,
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware().concat(googleMapsApi.middleware);
  },
});
