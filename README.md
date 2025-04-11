# Nutri AI

A premium AI-powered nutrition tracking and wellness app with Cal AI-inspired functionality and Studio Ghibli-inspired visual elements.

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm or yarn
- React Native development environment
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- Xcode (for iOS development)
- Android Studio (for Android development)
- Google AI API key (for food recognition)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory with:
     ```
     GOOGLE_AI_API_KEY=your_google_ai_api_key
     GEMINI_PRO_API_ENDPOINT=https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro-experimental:generateContent
     GEMINI_FLASH_API_ENDPOINT=https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent
     GEMINI_FLASH_LITE_API_ENDPOINT=https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent
     ```

### Running the App

#### Development

For local development:

```bash
# For iOS
npx expo run:ios

# For Android
npx expo run:android
```

### Testing with VS Code Emulator Extension

1. Install the "Emulate" extension in VS Code (DiemasMichiels.emulate)
2. Open Command Palette (Cmd+Shift+P / Ctrl+Shift+P)
3. Select "Emulate: Start iOS" or "Emulate: Start Android"
4. The app will build and launch in the selected emulator

## Building for App Stores

### Prerequisites

1. Create an Expo account at https://expo.dev
2. Set up your app on App Store Connect (iOS) and Google Play Console (Android)
3. Install EAS CLI: `npm install -g eas-cli`
4. Log in to your Expo account: `eas login`

### Configure Build Files

1. Update `app.json`:

   - Replace `projectId` with your actual Expo project ID
   - Update `owner` with your Expo username
   - Set proper bundle identifiers and package names

2. Update `eas.json`:
   - Configure iOS: Add your Apple ID, App Store Connect App ID, and Apple Team ID
   - Configure Android: Add path to your Google service account key file

### Building the App

```bash
# Configure your project with EAS
eas build:configure

# Build for internal testing (generates APK for Android and simulator build for iOS)
eas build --profile preview --platform all

# Build for production submission
eas build --profile production --platform all
```

### Submitting to App Stores

```bash
# Submit to Apple App Store
eas submit --platform ios

# Submit to Google Play Store
eas submit --platform android
```

## Troubleshooting

- If you encounter build issues, try cleaning the project:

  ```
  npx expo prebuild --clean
  ```

- For Pod installation issues:

  ```
  cd ios && pod install && cd ..
  ```

- Check the [Expo documentation](https://docs.expo.dev/) for more detailed troubleshooting.

## Project Structure

- `/app`: Main application code
  - `/assets`: App images and assets
  - `/components`: React components
  - `/navigation`: Navigation setup
  - `/screens`: App screens
  - `/services`: API services including AI integration
  - `/store`: Redux store configuration
  - `/utils`: Utility functions

## Testing

Run tests with:

```bash
npm test
```

## License

Proprietary - All rights reserved
