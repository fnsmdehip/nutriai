#!/bin/bash

# Install React Native Camera
npm install react-native-camera

# Add this to fix any remaining TypeScript errors in React Navigation
npm install @react-navigation/native-stack

# Run TypeScript to check remaining errors
echo "Running TypeScript check..."
npm run typecheck

echo "Installation complete. Check the TypeScript errors above to see what remains to be fixed."
echo "You might need to update individual component files to use ThemeCompat from app/utils/themeMapping.ts instead of Theme directly." 