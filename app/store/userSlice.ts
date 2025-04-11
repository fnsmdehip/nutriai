import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for user state
export interface UserMetrics {
  gender: 'male' | 'female' | 'other' | null;
  workoutFrequency: '0-2' | '3-5' | '6+' | null;
  weight: number | null;
  height: number | null;
  birthdate: string | null;
  goal: 'lose' | 'maintain' | 'gain' | null;
  dietType: 'classic' | 'pescatarian' | 'vegetarian' | 'vegan' | null;
  obstacles: string[];
  aims: string[];
  usesMetricSystem: boolean;
}

export interface OnboardingState {
  step: number;
  totalSteps: number;
  completed: boolean;
}

export interface UserState {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  metrics: UserMetrics;
  onboarding: OnboardingState;
  hasCompletedOnboarding: boolean;
  healthConnected: boolean;
}

// Initial state
const initialState: UserState = {
  isAuthenticated: true,
  userId: 'test-user-id',
  email: 'test@example.com',
  metrics: {
    gender: 'male',
    workoutFrequency: '3-5',
    weight: 70,
    height: 175,
    birthdate: '1990-01-01',
    goal: 'maintain',
    dietType: 'classic',
    obstacles: [],
    aims: [],
    usesMetricSystem: true,
  },
  onboarding: {
    step: 10,
    totalSteps: 10,
    completed: true,
  },
  hasCompletedOnboarding: true,
  healthConnected: false,
};

// Create the slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Authentication
    setAuthenticated: (state, action: PayloadAction<{ userId: string; email: string }>) => {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.email = action.payload.email;
    },
    logout: state => {
      return initialState;
    },

    // Onboarding navigation
    advanceOnboardingStep: state => {
      if (state.onboarding.step < state.onboarding.totalSteps) {
        state.onboarding.step += 1;
      }

      if (state.onboarding.step === state.onboarding.totalSteps) {
        state.onboarding.completed = true;
        state.hasCompletedOnboarding = true;
      }
    },
    goBackOnboardingStep: state => {
      if (state.onboarding.step > 1) {
        state.onboarding.step -= 1;
      }
    },

    // Metrics updates
    setGender: (state, action: PayloadAction<UserMetrics['gender']>) => {
      state.metrics.gender = action.payload;
    },
    setWorkoutFrequency: (state, action: PayloadAction<UserMetrics['workoutFrequency']>) => {
      state.metrics.workoutFrequency = action.payload;
    },
    setWeight: (state, action: PayloadAction<number>) => {
      state.metrics.weight = action.payload;
    },
    setHeight: (state, action: PayloadAction<number>) => {
      state.metrics.height = action.payload;
    },
    setBirthdate: (state, action: PayloadAction<string>) => {
      state.metrics.birthdate = action.payload;
    },
    setGoal: (state, action: PayloadAction<UserMetrics['goal']>) => {
      state.metrics.goal = action.payload;
    },
    setDietType: (state, action: PayloadAction<UserMetrics['dietType']>) => {
      state.metrics.dietType = action.payload;
    },
    toggleMetricSystem: state => {
      state.metrics.usesMetricSystem = !state.metrics.usesMetricSystem;
    },
    setObstacles: (state, action: PayloadAction<string[]>) => {
      state.metrics.obstacles = action.payload;
    },
    setAims: (state, action: PayloadAction<string[]>) => {
      state.metrics.aims = action.payload;
    },

    // Health connection
    setHealthConnected: (state, action: PayloadAction<boolean>) => {
      state.healthConnected = action.payload;
    },
  },
});

// Export actions and reducer
export const {
  setAuthenticated,
  logout,
  advanceOnboardingStep,
  goBackOnboardingStep,
  setGender,
  setWorkoutFrequency,
  setWeight,
  setHeight,
  setBirthdate,
  setGoal,
  setDietType,
  toggleMetricSystem,
  setObstacles,
  setAims,
  setHealthConnected,
} = userSlice.actions;

export default userSlice.reducer;
