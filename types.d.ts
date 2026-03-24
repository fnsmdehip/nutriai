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

// Navigation param list
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

// Make this file a module so `declare global` works correctly
export {};
