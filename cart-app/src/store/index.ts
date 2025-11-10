import { configureStore } from '@reduxjs/toolkit';
import cartServiceReducer from './cartServiceSlice';

export const store = configureStore({
  reducer: {
    cartService: cartServiceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;