import { RecognizedFood } from '../services/aiService';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type OnboardingStackParamList = {
  Gender: undefined;
  WorkoutFrequency: undefined;
  Attribution: undefined;
  HeightWeight: undefined;
  Goals: undefined;
  DietType: undefined;
  HealthConnect: undefined;
  PlanCalculation: undefined;
};

export type MainStackParamList = {
  Dashboard: undefined;
  FoodRecognition: undefined;
  EditFood: { food: RecognizedFood };
  FoodDetail: { foodId: string };
  NutritionAnalytics: undefined;
  Profile: undefined;
  Settings: undefined;
  Subscription: undefined;
};

export type RootStackParamList = 
  AuthStackParamList & 
  OnboardingStackParamList & 
  MainStackParamList; 