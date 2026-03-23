// This file contains type declarations for modules without their own type definitions

// Declare image file types
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.png' {
  const content: number;
  export default content;
}

declare module '*.jpg' {
  const content: number;
  export default content;
}

declare module '*.jpeg' {
  const content: number;
  export default content;
}

declare module '*.gif' {
  const content: number;
  export default content;
}

// Define global types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      DEBUG?: string;
      API_URL?: string;
      REVENUECAT_API_KEY?: string;
      ADMOB_APP_ID?: string;
      GOOGLE_AI_API_KEY?: string;
      [key: string]: string | undefined;
    }
  }

  // Augment window for potential web use
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: unknown;
  }

  // __DEV__ flag provided by React Native / Metro bundler
  const __DEV__: boolean;
}

// Add declarations for any other modules that need them
declare module 'react-native-reanimated' {
  export * from 'react-native-reanimated';
}

// For navigation types that might be missing
declare type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Analytics: undefined;
  FoodDetails: { foodId: string };
  AddFood: undefined;
  Camera: undefined;
  Paywall: undefined;
  Main: undefined;
};

// Export an empty object to make this file a module
export {};

// Keep existing type declarations below if any

// Existing content...
import { Theme } from '@react-navigation/native';

declare module '@react-navigation/native' {
  export interface Theme {
    dark: boolean;
    colors: {
      primary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
      // Custom colors defined in theme
      textSecondary: string;
      destructive: string;
      success: string;
      warning: string;
      tabIconDefault: string;
      tabIconSelected: string;
      separator: string;
      inputBackground: string;
      inputBorder: string;
      inputText: string;
      buttonBackground: string;
      buttonText: string;
      link: string;
    };
  }

  export function useTheme(): Theme;
}

// Add any other global type declarations needed for the project
