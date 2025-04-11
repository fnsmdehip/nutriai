# NUTRI AI FEATURE TESTING GUIDE

## INTRODUCTION

This document provides detailed testing procedures for each feature of the Nutri AI application. Each test includes step-by-step verification processes and expected results to ensure functionality works as specified in the PRD.

## 1. WELCOME & SIGNUP FLOW

### 1.1 Initial Welcome Screen

**Test Steps:**

1. Launch the app as a new user
2. Verify welcome screen displays with:
   - App dashboard preview
   - "Calorie tracking made easy" tagline
   - "Get Started" button
   - "Purchased on the web? Sign In" link
   - Today/Yesterday toggle in preview

**Expected Results:**

- Welcome screen appears with all specified elements
- Dashboard preview is visually accurate
- Buttons are properly positioned and styled

### 1.2 User Signup Flow

**Test Steps:**

1. Tap "Get Started" button
2. Enter email address
3. Create password
4. Verify email verification process

**Expected Results:**

- Email validation works correctly
- Password strength requirements enforced
- Account created successfully
- Verification email sent if required

## 2. ONBOARDING SEQUENCE

### 2.1 Gender Selection

**Test Steps:**

1. Verify screen shows Male/Female/Other options
2. Select each option and verify selection state
3. Test Back button functionality
4. Test Continue button functionality

**Expected Results:**

- Selection is visually indicated
- Progress indicator updates correctly
- Selection is saved when continuing to next screen

### 2.2 Workout Frequency

**Test Steps:**

1. Verify screen shows 0-2, 3-5, 6+ options
2. Confirm descriptive text appears for each option
3. Select each option and verify selection state
4. Test navigation between screens

**Expected Results:**

- All options display with correct descriptive text
- Selection state is visually clear
- Selection is saved when moving between screens

### 2.3 Attribution Tracking

**Test Steps:**

1. Verify "Where did you hear about us?" heading
2. Test scrolling through all options
3. Select different options and verify selection state
4. Test Back and Continue buttons

**Expected Results:**

- All options are visible through scrolling
- No pagination is present
- Selection state is visually clear

### 2.4 Height and Weight Input

**Test Steps:**

1. Test Imperial/Metric toggle
2. Enter various height values (valid and invalid)
3. Enter various weight values (valid and invalid)
4. Test unit conversion between systems

**Expected Results:**

- Input validation prevents invalid entries
- Unit conversion works correctly
- Values are saved when switching between units

### 2.5 Goal and Diet Selection

**Test Steps:**

1. Select each goal option (Lose/Maintain/Gain)
2. Select each diet type option
3. Test navigation between these screens
4. Test saving and retrieving these preferences

**Expected Results:**

- All options are selectable
- Selection state is visually clear
- Preferences are saved correctly

### 2.6 Progress Indicator

**Test Steps:**

1. Track progress indicator through each screen
2. Verify percentage updates correctly
3. Test interrupting and resuming onboarding

**Expected Results:**

- Progress indicator shows correct percentage
- Progress is saved if onboarding is interrupted
- Progress can be resumed from last completed step

## 3. HEALTH APP INTEGRATION

### 3.1 Health Integration Screen

**Test Steps:**

1. Verify health integration screen appears with correct visuals
2. Test "Continue" and "Not now" options
3. Check permission request dialogs

**Expected Results:**

- Integration screen shows activity icons and connection visualization
- Permission dialogs appear correctly
- User choice is respected (connect or skip)

### 3.2 iOS HealthKit Connection

**Test Steps:**

1. On iOS device, attempt to connect to Apple Health
2. Verify permission dialog appears with correct scopes
3. Test data reading after connection
4. Test data writing after connection

**Expected Results:**

- Permission dialog shows requested data types
- App can read activity, weight, heart rate, and sleep data
- App can write nutrition, water, and weight data

### 3.3 Android Google Fit Connection

**Test Steps:**

1. On Android device, attempt to connect to Google Fit
2. Verify permission dialog appears with correct scopes
3. Test data reading after connection
4. Test data writing after connection

**Expected Results:**

- Permission dialog shows requested data types
- App can read activity, weight, and sleep data
- App can write nutrition, water, and weight data

### 3.4 Activity Calorie Adjustment

**Test Steps:**

1. Connect to health app and sync activity data
2. Verify activity calorie adjustment screen appears
3. Test "Yes" and "No" options for adding calories
4. Verify calorie goal updates after adjustment

**Expected Results:**

- Activity data is correctly detected and displayed
- Calorie adjustment is applied when "Yes" is selected
- Adjustment is reflected in daily calorie goal

## 4. SUBSCRIPTION & TRIAL FLOW

### 4.1 Free Trial Offer

**Test Steps:**

1. Complete onboarding and plan creation
2. Verify trial offer screen appears with:
   - "We want you to try Nutri AI for free" headline
   - App dashboard preview
   - "No Payment Due Now" text
   - "Try for $0.00" button
   - Pricing information showing "$29.99 per year ($2.49/mo)"

**Expected Results:**

- Trial offer screen appears automatically after plan creation
- All elements display correctly with Studio Ghibli-inspired styling
- "Try for $0.00" button leads to payment method screen
- No option to skip the payment flow is available

### 4.2 Trial Reminder

**Test Steps:**

1. Verify reminder screen shows:
   - Notification bell icon with red badge (1)
   - "No Payment Due Now" reassurance text
   - "Continue for FREE" button
   - Annual pricing note beneath
2. Verify timeline visualization shows "Today → Reminder (2 days)"
3. Verify clear value proposition text

**Expected Results:**

- Timeline visualization appears correct with orange unlock icon
- Notification bell icon displayed with "In a few days - Reminder" text
- Clear explanation that trial unlocks all features

### 4.3 Subscription Options

**Test Steps:**

1. Verify subscription selection screen shows:
   - Monthly option ($9.99/mo) in gray, unselected state
   - Yearly option ($2.49/mo) in white with checkmark, pre-selected
   - "3 DAYS FREE" label on yearly option
   - "No Payment Due Now" reassurance below options
   - "Start My 3-Day Free Trial" primary button
2. Test selecting different subscription options
3. Proceed with subscription

**Expected Results:**

- Yearly option is visually emphasized and pre-selected
- Switching between options works correctly
- "Start My 3-Day Free Trial" button initiates payment flow
- Button has Studio Ghibli-inspired subtle animations

### 4.4 Special Offer Implementation

**Test Steps:**

1. Attempt to navigate away from subscription screen
2. Verify special offer modal appears with:
   - "One Time Offer" text with "You will never see this again" urgency
   - Gift icon and confetti animation
   - "Here's a 80% off discount" headline with party emoji
   - "Only $1.66 / month" prominently displayed
   - "Lowest price ever" supporting text
3. Test accepting and declining the offer

**Expected Results:**

- Modal triggers at correct time with Ghibli-styled animation
- Discount is clearly presented with visual urgency elements
- Accept/decline options function correctly
- Confetti animation has subtle watercolor effect

### 4.5 Restore Functionality

**Test Steps:**

1. Locate "Restore" link on subscription screens
2. Test restore functionality with:
   - Account with prior subscription
   - Account without prior subscription
3. Verify subscription state after restore

**Expected Results:**

- Restore link is visible
- Restore process works for accounts with prior purchases
- Appropriate message shows for accounts without prior purchases

## 5. MAIN DASHBOARD

### 5.1 Calorie Counter

**Test Steps:**

1. Log in to account with active plan
2. Verify calorie counter displays:
   - Large calorie number
   - "Calories left" label
3. Add food entries and verify counter updates

**Expected Results:**

- Calorie counter shows correct value
- Counter updates immediately when food is added
- Counter updates correctly when activity is synced

### 5.2 Macro Tracking

**Test Steps:**

1. Verify macro tracking cards show:
   - Protein remaining (g)
   - Carbs remaining (g)
   - Fat remaining (g)
2. Add food entries with known macros
3. Verify cards update correctly

**Expected Results:**

- Macro cards show correct values
- Values update accurately when food is added
- Visual indicators reflect consumption levels

### 5.3 Recently Eaten Section

**Test Steps:**

1. Add food entries using various methods
2. Verify recently eaten section shows:
   - Food photos when available
   - Food names and amounts
   - Timestamp information
3. Test processing status indicators

**Expected Results:**

- Recently eaten section shows correct entries
- Processing indicator appears during analysis
- Notification shows when processing is complete

### 5.4 Navigation and Controls

**Test Steps:**

1. Test bottom navigation tabs:
   - Home
   - Analytics
   - Settings
2. Test floating action button (+)
3. Test Today/Yesterday toggle

**Expected Results:**

- Navigation switches between tabs correctly
- Floating action button opens food entry methods
- Toggle switches between today's and yesterday's data

## 6. PHOTO FOOD RECOGNITION

### 6.1 Camera Integration

**Test Steps:**

1. Tap "+" button and select camera option
2. Verify camera opens with food-focusing overlay
3. Test taking photos of various food items
4. Test photo library access option

**Expected Results:**

- Camera opens with proper permissions
- Overlay helps with food positioning
- Photos can be captured successfully
- Photos can be selected from library

### 6.2 AI Food Recognition

**Test Steps:**

1. Take photos of single food items
2. Take photos with multiple food items
3. Test various lighting conditions
4. Test different portion sizes
5. Monitor processing time

**Expected Results:**

- Single foods are recognized accurately
- Multiple foods in one image are detected separately
- System works in various lighting conditions
- Portion size is estimated reasonably
- Processing completes within acceptable time (3-5 seconds)

### 6.3 Nutritional Calculation

**Test Steps:**

1. Verify recognized foods show:
   - Calorie content
   - Protein, carbs, and fat content
   - Portion size estimation
2. Compare against known nutritional values
3. Test adding recognized foods to diary

**Expected Results:**

- Nutritional values are calculated accurately
- Portion size affects calculations correctly
- Foods can be added to diary with correct values

### 6.4 User Correction Interface

**Test Steps:**

1. Intentionally test with ambiguous foods
2. Use correction interface to:
   - Change food identification
   - Adjust portion size
   - Add missing items
3. Verify changes are reflected in calculations

**Expected Results:**

- Correction interface is easy to use
- Changes update nutritional values immediately
- Corrected entries are saved accurately

## 7. CALORIE MANAGEMENT FEATURES

### 7.1 Activity Calorie Adjustment

**Test Steps:**

1. Connect to health app and sync activity data
2. Verify activity calories appear in dashboard
3. Test adding calories back to daily goal
4. Test declining to add activity calories

**Expected Results:**

- Activity calories are calculated correctly
- Adding calories increases daily goal
- Decision is respected and persistent

### 7.2 Calorie Rollover

**Test Steps:**

1. End a day with unused calories
2. Verify rollover screen appears
3. Test accepting and declining rollover
4. Verify rollover limit functionality

**Expected Results:**

- Unused calories are calculated correctly
- Rollover limit is enforced (e.g., max 200 calories)
- Rollover amount is added to next day when accepted
- Visual indicators show rollover amount

### 7.3 Visual Progress Display

**Test Steps:**

1. Add various food entries throughout the day
2. Verify circular indicators update
3. Test yesterday/today comparison
4. Check macro balance visualization

**Expected Results:**

- Circular indicators reflect consumption accurately
- Yesterday's data is preserved and comparable
- Macro balance visualization shows proportions correctly

## 8. VISUAL STYLING & GHIBLI ELEMENTS

### 8.1 Color Palette

**Test Steps:**

1. Verify app uses specified color palette:
   - #F8F5F0 backgrounds instead of white
   - #393939 text instead of black
   - Custom macro colors (#D67B56, #7C9A6F, #8AADC1)
2. Check for consistent use across all screens

**Expected Results:**

- Colors match specifications
- Palette is applied consistently
- Visual hierarchy is maintained

### 8.2 Textures and Elements

**Test Steps:**

1. Verify subtle watercolor textures on backgrounds
2. Check corner radius on cards and buttons (20px)
3. Verify hand-drawn quality of icons
4. Test shadow effects and organic patterns

**Expected Results:**

- Textures are visible but subtle (5-10% opacity)
- Corner radius is consistent
- Icons have slight hand-drawn quality
- Elements have organic styling

### 8.3 Animations and Transitions

**Test Steps:**

1. Navigate between screens and observe transitions
2. Interact with buttons and controls
3. Test loading and progress animations
4. Check macro updates and notification animations

**Expected Results:**

- Page transitions use gentle fade
- Buttons have soft pulse effect
- Loading indicators use watercolor-style animation
- Animations are subtle and under 300ms

### 8.4 Typography

**Test Steps:**

1. Verify font usage across different elements
2. Check letter spacing and line height
3. Test numerical displays and labels
4. Verify text scaling with system settings

**Expected Results:**

- Typography matches specifications
- Text is legible and properly spaced
- Numerical displays have subtle glow effect
- Text scales appropriately with system settings

## 9. BACKEND FUNCTIONALITY

### 9.1 Google AI API Integration

**Test Steps:**

1. Test food recognition with various images
2. Monitor API usage and fallback behavior
3. Test system under high load
4. Verify caching mechanism

**Expected Results:**

- API calls use preferred models when available
- System falls back to simpler models when needed
- Caching reduces duplicate API calls
- Resource usage stays within acceptable limits

### 9.2 Data Synchronization

**Test Steps:**

1. Test app usage across multiple devices
2. Verify data syncs correctly
3. Test offline functionality
4. Check sync conflicts resolution

**Expected Results:**

- Data syncs between devices quickly
- Offline changes are stored and synced later
- Conflicts are resolved intelligently
- No data loss occurs during synchronization

### 9.3 Resource Optimization

**Test Steps:**

1. Monitor memory usage during extended use
2. Check battery consumption
3. Test network data usage
4. Verify storage requirements

**Expected Results:**

- Memory usage remains stable
- Battery consumption is reasonable
- Network data usage is optimized
- Storage requirements are minimized

## 10. APP STORE COMPLIANCE

### 10.1 Subscription Compliance

**Test Steps:**

1. Verify subscription terms are clearly displayed
2. Test subscription management options
3. Check cancellation process
4. Verify receipt validation

**Expected Results:**

- Terms are clear and compliant with store policies
- Subscription can be managed within the app
- Cancellation process works correctly
- Receipts are properly validated

### 10.2 Privacy Compliance

**Test Steps:**

1. Verify privacy policy accessibility
2. Test data deletion functions
3. Check permission explanations
4. Verify data sharing controls

**Expected Results:**

- Privacy policy is easily accessible
- User data can be deleted on request
- Permission requests include clear explanations
- Data sharing is controlled by user preferences

### 10.3 Accessibility

**Test Steps:**

1. Test with VoiceOver/TalkBack
2. Verify color contrast ratios
3. Test with text size adjustments
4. Check reduced motion settings

**Expected Results:**

- Screen readers can access all content
- Color contrast meets accessibility standards
- UI adapts to system text size settings
- Animations respect reduced motion settings

## CONCLUSION

This testing guide provides comprehensive verification procedures for all features of the Nutri AI application. Each test should be performed during development to ensure functionality works as specified in the PRD. Follow the step-by-step processes and verify that results match expectations before proceeding to the next development phase.
