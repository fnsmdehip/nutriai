import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string | null;
  timestamp: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface NutritionGoals {
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
}

export interface NutritionState {
  foods: FoodItem[];
  goals: NutritionGoals;
  photoProcessing: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: NutritionState = {
  foods: [],
  goals: {
    dailyCalories: 2000,
    dailyProtein: 150,
    dailyCarbs: 200,
    dailyFat: 65,
  },
  photoProcessing: false,
  loading: false,
  error: null,
};

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    // Add a new food item
    addFood: (state, action: PayloadAction<FoodItem>) => {
      state.foods.push(action.payload);
    },
    
    // Update an existing food item
    updateFood: (state, action: PayloadAction<FoodItem>) => {
      const index = state.foods.findIndex(food => food.id === action.payload.id);
      if (index !== -1) {
        state.foods[index] = action.payload;
      }
    },
    
    // Delete a food item
    deleteFood: (state, action: PayloadAction<string>) => {
      state.foods = state.foods.filter(food => food.id !== action.payload);
    },
    
    // Update nutrition goals
    updateGoals: (state, action: PayloadAction<Partial<NutritionGoals>>) => {
      state.goals = { ...state.goals, ...action.payload };
    },
    
    // Clear all food data
    clearFoods: (state) => {
      state.foods = [];
    },
    
    // Start photo processing
    startPhotoProcessing: (state) => {
      state.photoProcessing = true;
    },
    
    // Finish photo processing
    finishPhotoProcessing: (state) => {
      state.photoProcessing = false;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Export actions
export const {
  addFood,
  updateFood,
  deleteFood,
  updateGoals,
  clearFoods,
  startPhotoProcessing,
  finishPhotoProcessing,
  setLoading,
  setError,
} = nutritionSlice.actions;

// Export selectors
export const selectAllFoods = (state: { nutrition: NutritionState }) => state.nutrition.foods;

export const selectFoodById = (state: { nutrition: NutritionState }, id: string) => 
  state.nutrition.foods.find(food => food.id === id);

export const selectTodaysFoods = (state: { nutrition: NutritionState }) => {
  const today = new Date().toISOString().split('T')[0];
  return state.nutrition.foods.filter(food => food.timestamp.startsWith(today));
};

export const selectNutritionGoals = (state: { nutrition: NutritionState }) => state.nutrition.goals;

export const selectPhotoProcessing = (state: { nutrition: NutritionState }) => state.nutrition.photoProcessing;

export const selectDailyNutritionTotals = (state: { nutrition: NutritionState }) => {
  const todaysFoods = selectTodaysFoods(state);
  
  return {
    calories: todaysFoods.reduce((sum, food) => sum + food.calories, 0),
    protein: todaysFoods.reduce((sum, food) => sum + food.protein, 0),
    carbs: todaysFoods.reduce((sum, food) => sum + food.carbs, 0),
    fat: todaysFoods.reduce((sum, food) => sum + food.fat, 0),
  };
};

export default nutritionSlice.reducer; 