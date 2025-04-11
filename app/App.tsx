import React, { useEffect, useState } from 'react';
import { StatusBar, LogBox, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigator from './navigation/MainNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import OnboardingNavigator from './navigation/OnboardingNavigator';
import ApiTestScreen from './screens/main/ApiTestScreen';
import { RootState } from './store';
import { Theme } from './utils/theme';

// Ignore specific warnings
LogBox.ignoreLogs(['ViewPropTypes will be removed', 'ColorPropType will be removed']);

const Stack = createStackNavigator();

// For direct testing
const DirectTestNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ApiTest" component={ApiTestScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  const [initializing, setInitializing] = useState(true);
  // Set default to true so we go straight to the test screen
  const [directToTest, setDirectToTest] = useState(true);
  const { isAuthenticated, hasCompletedOnboarding } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Simulate initialization
    setTimeout(() => {
      setInitializing(false);
    }, 500); // Reduced to 500ms for faster startup
  }, []);

  if (initializing) {
    // Return splash screen component
    return null;
  }

  // Always start with the API test screen
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      <NavigationContainer>
        <DirectTestNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  testButtonContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    zIndex: 100,
  },
  testButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  testButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
