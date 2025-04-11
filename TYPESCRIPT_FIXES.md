# TypeScript Error Fixes Guide

This document provides guidance on how to fix the common TypeScript errors in the codebase.

## Installation

First, ensure you have installed all required dependencies:

```bash
# Install basic dependencies
npm install

# Install remaining dependencies using the provided script
./install-remaining-deps.sh
```

## Common Error Types and Fixes

### 1. Theme Property Naming Inconsistencies

Many errors are related to inconsistent theme property naming. We've created a compatibility layer to help fix these:

**Error example:**
```typescript
paddingHorizontal: Theme.spacing.l,  // Error: Property 'l' does not exist
fontSize: Theme.typography.fontSize.medium,  // Error: Property 'medium' does not exist
```

**Fix:**
```typescript
import { ThemeCompat } from '../../utils/themeMapping';

// Then use ThemeCompat instead of Theme
paddingHorizontal: ThemeCompat.spacing.l,  // Works with both old and new naming
fontSize: ThemeCompat.typography.fontSize.medium,  // Works with both old and new naming
```

### 2. Missing Type Definitions for Component Props

**Error example:**
```typescript
tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
// Error: Binding element 'color' implicitly has an 'any' type.
```

**Fix:**
```typescript
tabBarIcon: ({ color, size }: { color: string; size: number }) => (
  <HomeIcon color={color} size={size} />
),
```

### 3. Implicit Any Types in Array Functions

**Error example:**
```typescript
const foodFromToday = allFoods.today.find(f => f.id === foodId);
// Error: Parameter 'f' implicitly has an 'any' type.
```

**Fix:**
```typescript
const foodFromToday = allFoods.today.find((f: FoodItem) => f.id === foodId);
```

### 4. Missing Redux Action Types

**Error example:**
```typescript
addFood: (state, action: PayloadAction<FoodItem>) => {
// Error: Parameter 'state' implicitly has an 'any' type.
```

**Fix:**
```typescript
addFood: (state: NutritionState, action: PayloadAction<FoodItem>) => {
```

### 5. Button Component Props Issues

**Error example:**
```typescript
<Button fullWidth title="Add Food" />
// Error: Property 'fullWidth' does not exist on type 'IntrinsicAttributes & ButtonProps'.
```

**Fix:**
Update the Button component's props interface to include these properties, or use spread props:

```typescript
export interface ButtonProps extends TouchableOpacityProps {
  // ... existing props
  fullWidth?: boolean;
  color?: ThemeColor;
}
```

## Step-by-Step Approach to Fix All Errors

1. **Navigation-related errors**
   - Install all React Navigation dependencies
   - Create missing screen files that are imported but don't exist

2. **Theme-related errors**
   - Update component imports to use `ThemeCompat` instead of `Theme`

3. **Redux-related errors**
   - Add proper state types to all reducer functions
   - Fix missing action creators in the slices

4. **Undefined imports**
   - Create missing icon components
   - Add missing screen components

5. **Prop-related errors**
   - Update component props to include proper TypeScript interfaces

## Using TypeScript Directives

For cases where you can't immediately fix a type issue, you can use TypeScript directives:

```typescript
// @ts-ignore - Ignores the next line
// @ts-expect-error - Explicitly acknowledge an expected error
// @ts-nocheck - Disable checking for the whole file (use sparingly!)
```

**Example:**
```typescript
// @ts-expect-error - Button component needs to be updated to include fullWidth prop
<Button fullWidth title="Add Food" />
```

Remember that these directives are temporary solutions. The better approach is to fix the underlying type issues.

## Automated Fixes

Run the format script to automatically fix some issues:

```bash
npm run format
```

To enforce type checking on commits, the pre-commit hook is set up to run linting and type checking. 