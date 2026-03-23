import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { store } from './store';
import { Theme } from './utils/theme';

// Screens
import OnboardingScreen from './screens/Onboarding';
import HomeScreen from './screens/Home';
import AnalyticsScreen from './screens/Analytics';
import SettingsScreen from './screens/Settings';
import CameraScreen from './screens/Camera';
import PaywallScreen from './screens/Paywall';

// Services
import { initPurchases, checkEntitlements } from './services/purchases';
import { preloadAllAds } from './services/ads';
import { setSubscriptionTier, setPremiumStatus } from './store/subscriptionSlice';
import type { SubscriptionTier } from './store/subscriptionSlice';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Camera') {
            iconName = 'camera-alt';
          } else if (route.name === 'Analytics') {
            iconName = 'insert-chart';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.inactive,
        tabBarStyle: {
          backgroundColor: Theme.colors.card,
          borderTopWidth: 0,
          elevation: 8,
          height: 60,
          paddingBottom: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen
        name="Paywall"
        component={PaywallScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

function AppInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    async function bootstrap() {
      try {
        // Initialize RevenueCat
        await initPurchases();

        // Check existing entitlements
        const { isPremium } = await checkEntitlements();
        store.dispatch(setPremiumStatus(isPremium));

        // Only preload ads for free users
        if (!isPremium) {
          preloadAllAds();
        }
      } catch (error) {
        console.error('[App] Bootstrap error:', error);
        // App still works without purchases - free tier is the fallback
        preloadAllAds();
      }
    }

    bootstrap();
  }, []);

  return <>{children}</>;
}

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
        <AppInitializer>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AppInitializer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
