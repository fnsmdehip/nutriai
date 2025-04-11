#!/bin/bash

# Stop script on error
set -e

echo "🚀 Preparing Nutri AI for building..."

# Clean installation
echo "📦 Cleaning and reinstalling dependencies..."
rm -rf node_modules
npm install

# Run TypeScript checks
echo "🔍 Running TypeScript type checking..."
npm run typecheck

# Run ESLint
echo "🧹 Running ESLint..."
npm run lint

# Clean iOS build artifacts
echo "🧹 Cleaning iOS build artifacts..."
if [ -d "ios/build" ]; then
  rm -rf ios/build
fi

# Clean iOS Pods
echo "♻️ Reinstalling iOS Pods..."
if [ -d "ios/Pods" ]; then
  cd ios
  rm -rf Pods
  rm -f Podfile.lock
  pod install
  cd ..
fi

# Clean Android build artifacts
echo "🧹 Cleaning Android build artifacts..."
if [ -d "android/app/build" ]; then
  rm -rf android/app/build
fi

# Verify .env file
echo "🔒 Checking environment variables..."
if [ ! -f ".env" ]; then
  echo "⚠️ .env file not found. Creating template..."
  cat > .env << EOL
GOOGLE_AI_API_KEY=your_google_ai_api_key
GEMINI_PRO_API_ENDPOINT=https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro-experimental:generateContent
GEMINI_FLASH_API_ENDPOINT=https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent
GEMINI_FLASH_LITE_API_ENDPOINT=https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent
EOL
  echo "⚠️ Please update the .env file with your actual API keys."
fi

# Verify app.json has a project ID
grep -q "projectId.*replace-with-actual-project-id" app.json
if [ $? -eq 0 ]; then
  echo "⚠️ Please update app.json with your actual Expo project ID."
fi

# Run EAS whoami to check login status
echo "🔑 Verifying EAS login status..."
npx eas whoami || (echo "❗ Please login to EAS with 'npx eas login'" && npx eas login)

echo "✅ Preparation complete! You can now build the app with:"
echo "npx eas build --profile preview --platform all"
echo "Or submit to stores with:"
echo "npx eas build --profile production --platform all"
