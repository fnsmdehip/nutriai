import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GenderSelectionScreen from '../screens/onboarding/GenderSelectionScreen';
import WorkoutFrequencyScreen from '../screens/onboarding/WorkoutFrequencyScreen';
import AttributionScreen from '../screens/onboarding/AttributionScreen';
import HeightWeightScreen from '../screens/onboarding/HeightWeightScreen';
import BirthdateScreen from '../screens/onboarding/BirthdateScreen';
import GoalSelectionScreen from '../screens/onboarding/GoalSelectionScreen';
import DietTypeScreen from '../screens/onboarding/DietTypeScreen';
import ObstaclesScreen from '../screens/onboarding/ObstaclesScreen';
import AimsScreen from '../screens/onboarding/AimsScreen';
import HealthConnectScreen from '../screens/onboarding/HealthConnectScreen';
import PlanCalculationScreen from '../screens/onboarding/PlanCalculationScreen';
import PlanCompletionScreen from '../screens/onboarding/PlanCompletionScreen';
import ReferralCodeScreen from '../screens/onboarding/ReferralCodeScreen';

export type OnboardingStackParamList = {
  GenderSelection: undefined;
  WorkoutFrequency: undefined;
  Attribution: undefined;
  HeightWeight: undefined;
  Birthdate: undefined;
  GoalSelection: undefined;
  DietType: undefined;
  Obstacles: undefined;
  Aims: undefined;
  HealthConnect: undefined;
  PlanCalculation: undefined;
  PlanCompletion: undefined;
  ReferralCode: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="GenderSelection"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F8F5F0' },
        gestureEnabled: false, // Prevent back swipe gesture
      }}
    >
      <Stack.Screen name="GenderSelection" component={GenderSelectionScreen} />
      <Stack.Screen name="WorkoutFrequency" component={WorkoutFrequencyScreen} />
      <Stack.Screen name="Attribution" component={AttributionScreen} />
      <Stack.Screen name="HeightWeight" component={HeightWeightScreen} />
      <Stack.Screen name="Birthdate" component={BirthdateScreen} />
      <Stack.Screen name="GoalSelection" component={GoalSelectionScreen} />
      <Stack.Screen name="DietType" component={DietTypeScreen} />
      <Stack.Screen name="Obstacles" component={ObstaclesScreen} />
      <Stack.Screen name="Aims" component={AimsScreen} />
      <Stack.Screen name="HealthConnect" component={HealthConnectScreen} />
      <Stack.Screen name="PlanCalculation" component={PlanCalculationScreen} />
      <Stack.Screen name="PlanCompletion" component={PlanCompletionScreen} />
      <Stack.Screen name="ReferralCode" component={ReferralCodeScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator; 