import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { store } from './store';
import { Theme } from './utils/theme';
import { haptics } from './utils/haptics';

import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/Onboarding';
import HomeScreen from './screens/Home';
import AnalyticsScreen from './screens/Analytics';
import SettingsScreen from './screens/Settings';
import CameraScreen from './screens/Camera';
import PaywallScreen from './screens/Paywall';

import { setPremiumStatus } from './store/subscriptionSlice';
import { useAppSelector } from './store/hooks';

type TabParamList = {
  Home: undefined;
  Camera: undefined;
  Analytics: undefined;
  Settings: undefined;
};

type RootStackParamList = {
  Main: undefined;
  Paywall: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function getTabBarIcon(
  routeName: string,
  focused: boolean,
  color: string,
  size: number,
): React.ReactNode {
  let iconName: keyof typeof Ionicons.glyphMap;

  switch (routeName) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'Camera':
      iconName = focused ? 'camera' : 'camera-outline';
      break;
    case 'Analytics':
      iconName = focused ? 'bar-chart' : 'bar-chart-outline';
      break;
    case 'Settings':
      iconName = focused ? 'settings' : 'settings-outline';
      break;
    default:
      iconName = 'home-outline';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
}

function MainTabs(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => getTabBarIcon(route.name, focused, color, size),
        tabBarActiveTintColor: '#2ED573',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: Theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.04)',
          elevation: 0,
          height: 88,
          paddingBottom: 28,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600' as const,
          marginTop: 2,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Today' }}
        listeners={{
          tabPress: () => haptics.light(),
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{ tabBarLabel: 'Scan' }}
        listeners={{
          tabPress: () => haptics.light(),
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ tabBarLabel: 'Insights' }}
        listeners={{
          tabPress: () => haptics.light(),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: 'Settings' }}
        listeners={{
          tabPress: () => haptics.light(),
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Paywall" component={PaywallScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}

type AppPhase = 'splash' | 'onboarding' | 'paywall' | 'app';

function AppContent(): React.JSX.Element {
  const hasCompletedOnboarding = useAppSelector(state => state.user.hasCompletedOnboarding);
  const [phase, setPhase] = useState<AppPhase>('splash');
  const [hasSeenPaywall, setHasSeenPaywall] = useState(false);

  useEffect(() => {
    store.dispatch(setPremiumStatus(false));
  }, []);

  const handleSplashFinish = useCallback(() => {
    if (hasCompletedOnboarding) {
      setPhase('app');
    } else {
      setPhase('onboarding');
    }
  }, [hasCompletedOnboarding]);

  const handleOnboardingComplete = useCallback(() => {
    if (!hasSeenPaywall) {
      setPhase('paywall');
      setHasSeenPaywall(true);
    } else {
      setPhase('app');
    }
  }, [hasSeenPaywall]);

  const handlePaywallDismiss = useCallback(() => {
    setPhase('app');
  }, []);

  switch (phase) {
    case 'splash':
      return <SplashScreen onFinish={handleSplashFinish} />;
    case 'onboarding':
      return <OnboardingScreen onComplete={handleOnboardingComplete} />;
    case 'paywall':
      return <InitialPaywallWrapper onDismiss={handlePaywallDismiss} />;
    case 'app':
      return (
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      );
    default:
      return <SplashScreen onFinish={handleSplashFinish} />;
  }
}

function InitialPaywallWrapper({ onDismiss }: { onDismiss: () => void }): React.JSX.Element {
  return (
    <NavigationContainer>
      <InitialPaywallNavigator onDismiss={onDismiss} />
    </NavigationContainer>
  );
}

const InitialPaywallStack = createStackNavigator();

function InitialPaywallNavigator({ onDismiss }: { onDismiss: () => void }): React.JSX.Element {
  return (
    <InitialPaywallStack.Navigator screenOptions={{ headerShown: false }}>
      <InitialPaywallStack.Screen name="PaywallInitial">
        {() => <PaywallWithDismiss onDismiss={onDismiss} />}
      </InitialPaywallStack.Screen>
    </InitialPaywallStack.Navigator>
  );
}

function PaywallWithDismiss({ onDismiss }: { onDismiss: () => void }): React.JSX.Element {
  const isPremium = useAppSelector(state => state.subscription.isPremium);

  useEffect(() => {
    if (isPremium) {
      onDismiss();
    }
  }, [isPremium, onDismiss]);

  return (
    <View style={styles.paywallContainer}>
      <PaywallScreen />
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => {
          haptics.light();
          onDismiss();
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
}

const App = (): React.JSX.Element => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={Theme.colors.background} />
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  paywallContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  skipButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    color: Theme.colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
});

export default App;
