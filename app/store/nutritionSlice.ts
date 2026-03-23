import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
  timestamp: number;
}

interface NutritionState {
  dailyGoal: {
    calories: number;
    protein: number; // in grams
    carbs: number; // in grams
    fat: number; // in grams
  };
  consumedItems: {
    [date: string]: Food[];
  };
  processing: boolean;
  processingStatus: string;
  activeDate: string; // ISO date string
}

const todayIsoDate = new Date().toISOString().split('T')[0];

const initialState: NutritionState = {
  dailyGoal: {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 70,
  },
  consumedItems: {
    [todayIsoDate]: [],
  },
  processing: false,
  processingStatus: '',
  activeDate: todayIsoDate,
};

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    setDailyGoal: (state, action: PayloadAction<{ calories: number; protein: number; carbs: number; fat: number }>) => {
      state.dailyGoal = action.payload;
    },
    addConsumedItem: (state, action: PayloadAction<Food>) => {
      const date = state.activeDate;
      if (!state.consumedItems[date]) {
        state.consumedItems[date] = [];
      }
      state.consumedItems[date].push(action.payload);
    },
    removeConsumedItem: (state, action: PayloadAction<string>) => {
      const date = state.activeDate;
      if (state.consumedItems[date]) {
        state.consumedItems[date] = state.consumedItems[date].filter(
          (item) => item.id !== action.payload
        );
      }
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.processing = action.payload;
    },
    setProcessingStatus: (state, action: PayloadAction<string>) => {
      state.processingStatus = action.payload;
    },
    setActiveDate: (state, action: PayloadAction<string>) => {
      state.activeDate = action.payload;
      if (!state.consumedItems[action.payload]) {
        state.consumedItems[action.payload] = [];
      }
    },
  },
});

export const {
  setDailyGoal,
  addConsumedItem,
  removeConsumedItem,
  setProcessing,
  setProcessingStatus,
  setActiveDate,
} = nutritionSlice.actions;

export default nutritionSlice.reducer; 