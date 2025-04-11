#!/bin/bash

# Nutri AI Project Setup Script
echo "🚀 Setting up Nutri AI project..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Set up Husky
echo "🐕 Setting up Git hooks with Husky..."
npm run prepare

# Step 3: Install remaining dependencies
echo "🔧 Installing additional dependencies..."
npm install react-native-camera @react-navigation/native-stack

# Step 4: Fix TypeScript issues
echo "🔍 Fixing common TypeScript issues..."
node fix-type-issues.js

# Step 5: Update Theme imports
echo "🎨 Updating Theme imports to use ThemeCompat..."
node update-theme-imports.js

# Step 6: Format code
echo "✨ Formatting code with Prettier..."
npm run format

# Step 7: Final TypeScript check
echo "✅ Running final TypeScript check..."
npm run typecheck

echo "
🎉 Setup complete! Here are your next steps:

- Review remaining TypeScript errors (if any)
- Create missing component files referenced in imports
- Check out TYPESCRIPT_FIXES.md for guidance on fixing type issues

To start development, use:
- npm run lint    - Check for linting issues
- npm run format  - Format code
- npm start       - Start the development server
" 