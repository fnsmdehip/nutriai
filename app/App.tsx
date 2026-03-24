import React, { useEffect, useState } from 'react';
import { StatusBar, ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { store } from './store';
import { Theme } from './utils/theme';

import HomeScreen from './screens/Home';
import AnalyticsScreen from './screens/Analytics';
import SettingsScreen from './screens/Settings';
import CameraScreen from './screens/Camera';
import PaywallScreen from './screens/Paywall';

import { setPremiumStatus } from './store/subscriptionSlice';

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
const Stack = createNativeStackNavigator<RootStackParamList>();

function getTabBarIcon(routeName: string, color: string, size: number): React.ReactNode {
  let iconName: keyof typeof Ionicons.glyphMap;

  switch (routeName) {
    case 'Home':
      iconName = 'home';
      break;
    case 'Camera':
      iconName = 'camera';
      break;
    case 'Analytics':
      iconName = 'bar-chart';
      break;
    case 'Settings':
      iconName = 'settings';
      break;
    default:
      iconName = 'home';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
}

function MainTabs(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => getTabBarIcon(route.name, color, size),
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.inactive,
        tabBarStyle: {
          backgroundColor: Theme.colors.surface,
          borderTopWidth: 0,
          elevation: 0,
          height: 88,
          paddingBottom: 28,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600' as const,
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

function AppNavigator(): React.JSX.Element {
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

function AppInitializer({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function bootstrap(): Promise<void> {
      try {
        // In production, initialize RevenueCat and check entitlements here.
        // For now, default to free tier.
        store.dispatch(setPremiumStatus(false));
      } finally {
        setIsReady(true);
      }
    }

    bootstrap();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

const App = (): React.JSX.Element => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={Theme.colors.background} />
        <AppInitializer>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AppInitializer>
      </SafeAreaProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
  },
});

export default App;
