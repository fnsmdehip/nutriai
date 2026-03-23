import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  userProfile: {
    gender: 'male' | 'female' | 'other' | null;
    birthdate: string | null;
    height: number | null;
    weight: number | null;
    workoutFrequency: '0-2' | '3-5' | '6+' | null;
    goal: 'lose' | 'maintain' | 'gain' | null;
    dietType: 'regular' | 'pescatarian' | 'vegetarian' | 'vegan' | null;
  };
  onboardingProgress: number;
}

const initialState: UserState = {
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  userProfile: {
    gender: null,
    birthdate: null,
    height: null,
    weight: null,
    workoutFrequency: null,
    goal: null,
    dietType: null,
  },
  onboardingProgress: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
    completeOnboarding: (state) => {
      state.hasCompletedOnboarding = true;
    },
    setGender: (state, action: PayloadAction<'male' | 'female' | 'other'>) => {
      state.userProfile.gender = action.payload;
    },
    setBirthdate: (state, action: PayloadAction<string>) => {
      state.userProfile.birthdate = action.payload;
    },
    setHeight: (state, action: PayloadAction<number>) => {
      state.userProfile.height = action.payload;
    },
    setWeight: (state, action: PayloadAction<number>) => {
      state.userProfile.weight = action.payload;
    },
    setWorkoutFrequency: (state, action: PayloadAction<'0-2' | '3-5' | '6+' | null>) => {
      state.userProfile.workoutFrequency = action.payload;
    },
    setGoal: (state, action: PayloadAction<'lose' | 'maintain' | 'gain' | null>) => {
      state.userProfile.goal = action.payload;
    },
    setDietType: (state, action: PayloadAction<'regular' | 'pescatarian' | 'vegetarian' | 'vegan' | null>) => {
      state.userProfile.dietType = action.payload;
    },
    advanceOnboardingStep: (state) => {
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
  setBirthdate,
  setHeight,
  setWeight,
  setWorkoutFrequency,
  setGoal,
  setDietType,
  advanceOnboardingStep,
  setOnboardingProgress,
} = userSlice.actions;

export default userSlice.reducer; 