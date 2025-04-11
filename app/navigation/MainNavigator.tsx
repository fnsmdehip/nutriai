import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/main/HomeScreen';
import AnalyticsScreen from '../screens/main/AnalyticsScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import CameraScreen from '../screens/main/CameraScreen';
import AddFoodScreen from '../screens/main/AddFoodScreen';
import FoodDetailsScreen from '../screens/main/FoodDetailsScreen';
import CalorieAdjustmentScreen from '../screens/main/CalorieAdjustmentScreen';
import RolloverScreen from '../screens/main/RolloverScreen';
import SubscriptionScreen from '../screens/subscription/SubscriptionScreen';
import TrialOfferScreen from '../screens/subscription/TrialOfferScreen';
import SpecialOfferScreen from '../screens/subscription/SpecialOfferScreen';
import ApiTestScreen from '../screens/main/ApiTestScreen';
import { Theme } from '../utils/theme';
import HomeIcon from '../components/icons/HomeIcon';
import AnalyticsIcon from '../components/icons/AnalyticsIcon';
import SettingsIcon from '../components/icons/SettingsIcon';

// Stack param lists
export type HomeStackParamList = {
  Home: undefined;
  AddFood: undefined;
  Camera: undefined;
  FoodDetails: { foodId: string };
  CalorieAdjustment: { caloriesBurned: number };
  Rollover: { caloriesRemaining: number };
  TrialOffer: undefined;
  Subscription: undefined;
  SpecialOffer: undefined;
};

export type AnalyticsStackParamList = {
  Analytics: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
  ApiTest: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  AnalyticsTab: undefined;
  SettingsTab: undefined;
};

// Create stacks for each tab
const HomeStack = createStackNavigator<HomeStackParamList>();
const AnalyticsStack = createStackNavigator<AnalyticsStackParamList>();
const SettingsStack = createStackNavigator<SettingsStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Home stack
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Theme.colors.background },
      }}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="AddFood" component={AddFoodScreen} />
      <HomeStack.Screen name="Camera" component={CameraScreen} />
      <HomeStack.Screen name="FoodDetails" component={FoodDetailsScreen} />
      <HomeStack.Screen name="CalorieAdjustment" component={CalorieAdjustmentScreen} />
      <HomeStack.Screen name="Rollover" component={RolloverScreen} />
      <HomeStack.Screen name="TrialOffer" component={TrialOfferScreen} />
      <HomeStack.Screen name="Subscription" component={SubscriptionScreen} />
      <HomeStack.Screen name="SpecialOffer" component={SpecialOfferScreen} />
    </HomeStack.Navigator>
  );
};

// Analytics stack
const AnalyticsStackNavigator = () => {
  return (
    <AnalyticsStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Theme.colors.background },
      }}
    >
      <AnalyticsStack.Screen name="Analytics" component={AnalyticsScreen} />
    </AnalyticsStack.Navigator>
  );
};

// Settings stack
const SettingsStackNavigator = () => {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Theme.colors.background },
      }}
    >
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="ApiTest" component={ApiTestScreen} />
    </SettingsStack.Navigator>
  );
};

// Main tab navigator
const MainNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Theme.colors.background,
          borderTopColor: Theme.colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="AnalyticsTab"
        component={AnalyticsStackNavigator}
        options={{
          tabBarLabel: 'Analytics',
          tabBarIcon: ({ color, size }) => <AnalyticsIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => <SettingsIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
