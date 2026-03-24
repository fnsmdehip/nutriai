import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Gender = 'male' | 'female' | 'other';
export type Goal = 'lose' | 'maintain' | 'gain';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'athlete';
export type DietType = 'regular' | 'pescatarian' | 'vegetarian' | 'vegan';

export interface UserProfile {
  gender: Gender | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  goalWeight: number | null;
  goal: Goal | null;
  activityLevel: ActivityLevel | null;
  dietType: DietType | null;
  dailyCalories: number;
  proteinGoal: number;
  carbGoal: number;
  fatGoal: number;
  useImperial: boolean;
}

interface UserState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  userProfile: UserProfile;
  onboardingProgress: number;
}

const initialState: UserState = {
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  userProfile: {
    gender: null,
    age: null,
    heightCm: null,
    weightKg: null,
    goalWeight: null,
    goal: null,
    activityLevel: null,
    dietType: null,
    dailyCalories: 2000,
    proteinGoal: 150,
    carbGoal: 200,
    fatGoal: 70,
    useImperial: true,
  },
  onboardingProgress: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: state => {
      state.isAuthenticated = true;
    },
    logout: state => {
      state.isAuthenticated = false;
    },
    completeOnboarding: state => {
      state.hasCompletedOnboarding = true;
    },
    setGender: (state, action: PayloadAction<Gender>) => {
      state.userProfile.gender = action.payload;
    },
    setAge: (state, action: PayloadAction<number>) => {
      state.userProfile.age = action.payload;
    },
    setHeightCm: (state, action: PayloadAction<number>) => {
      state.userProfile.heightCm = action.payload;
    },
    setWeightKg: (state, action: PayloadAction<number>) => {
      state.userProfile.weightKg = action.payload;
    },
    setGoalWeight: (state, action: PayloadAction<number | null>) => {
      state.userProfile.goalWeight = action.payload;
    },
    setGoal: (state, action: PayloadAction<Goal>) => {
      state.userProfile.goal = action.payload;
    },
    setActivityLevel: (state, action: PayloadAction<ActivityLevel>) => {
      state.userProfile.activityLevel = action.payload;
    },
    setDietType: (state, action: PayloadAction<DietType>) => {
      state.userProfile.dietType = action.payload;
    },
    setUseImperial: (state, action: PayloadAction<boolean>) => {
      state.userProfile.useImperial = action.payload;
    },
    setCalculatedNutrition: (
      state,
      action: PayloadAction<{
        dailyCalories: number;
        proteinGoal: number;
        carbGoal: number;
        fatGoal: number;
      }>,
    ) => {
      state.userProfile.dailyCalories = action.payload.dailyCalories;
      state.userProfile.proteinGoal = action.payload.proteinGoal;
      state.userProfile.carbGoal = action.payload.carbGoal;
      state.userProfile.fatGoal = action.payload.fatGoal;
    },
    advanceOnboardingStep: state => {
      state.onboardingProgress += 1;
    },
    setOnboardingProgress: (state, action: PayloadAction<number>) => {
      state.onboardingProgress = action.payload;
    },
  },
});

export const {
  login,
  logout,
  completeOnboarding,
  setGender,
  setAge,
  setHeightCm,
  setWeightKg,
  setGoalWeight,
  setGoal,
  setActivityLevel,
  setDietType,
  setUseImperial,
  setCalculatedNutrition,
  advanceOnboardingStep,
  setOnboardingProgress,
} = userSlice.actions;

export default userSlice.reducer;
