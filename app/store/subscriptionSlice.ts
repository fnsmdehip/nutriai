import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SubscriptionTier = 'free' | 'monthly' | 'yearly' | 'lifetime';

export interface SubscriptionState {
  tier: SubscriptionTier;
  isPremium: boolean;
  dailyScansUsed: number;
  dailyScanLimit: number;
  lastScanResetDate: string; // ISO date string
  foodScansCompleted: number; // total scans since install, for interstitial ad pacing
  isLoading: boolean;
  error: string | null;
}

const todayIsoDate = new Date().toISOString().split('T')[0];

const initialState: SubscriptionState = {
  tier: 'free',
  isPremium: false,
  dailyScansUsed: 0,
  dailyScanLimit: 3,
  lastScanResetDate: todayIsoDate,
  foodScansCompleted: 0,
  isLoading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscriptionTier: (state, action: PayloadAction<SubscriptionTier>) => {
      state.tier = action.payload;
      state.isPremium = action.payload !== 'free';
      if (state.isPremium) {
        state.dailyScanLimit = 999;
      } else {
        state.dailyScanLimit = 3;
      }
    },
    setPremiumStatus: (state, action: PayloadAction<boolean>) => {
      state.isPremium = action.payload;
      if (action.payload) {
        state.dailyScanLimit = 999;
      } else {
        state.tier = 'free';
        state.dailyScanLimit = 3;
      }
    },
    incrementDailyScans: (state) => {
      const today = new Date().toISOString().split('T')[0];
      if (state.lastScanResetDate !== today) {
        state.dailyScansUsed = 1;
        state.lastScanResetDate = today;
      } else {
        state.dailyScansUsed += 1;
      }
      state.foodScansCompleted += 1;
    },
    addBonusScan: (state) => {
      // Rewarded ad grants one extra scan for the day
      if (state.dailyScansUsed > 0) {
        state.dailyScansUsed -= 1;
      }
    },
    resetDailyScans: (state) => {
      state.dailyScansUsed = 0;
      state.lastScanResetDate = new Date().toISOString().split('T')[0];
    },
    setSubscriptionLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSubscriptionError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSubscriptionTier,
  setPremiumStatus,
  incrementDailyScans,
  addBonusScan,
  resetDailyScans,
  setSubscriptionLoading,
  setSubscriptionError,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
