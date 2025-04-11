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
      [key: string]: string | undefined;
    }
  }
  
  // Augment window for potential web use
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
  }
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
  // Add other screens as needed
};

// Export an empty object to make this file a module
export {}; 