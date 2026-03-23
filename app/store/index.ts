import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import nutritionReducer from './nutritionSlice';
import subscriptionReducer from './subscriptionSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    nutrition: nutritionReducer,
    subscription: subscriptionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
