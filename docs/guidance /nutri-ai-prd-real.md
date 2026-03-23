# NUTRI AI: APP DEVELOPMENT PROMPT DOCUMENT

## INTRODUCTION

This document provides structured prompts for developing a cross-platform mobile application that offers premium AI-powered nutrition tracking and wellness guidance. The prompts are designed to be used with Cursor IDE leveraging Claude 3.7 model in thinking mode, focusing on creating a unique app experience with Studio Ghibli-inspired visual elements while maintaining a clean, functional interface.

## SYSTEM OVERVIEW

Nutri AI is a dual-purpose application that functions as both an intuitive calorie tracker and an advanced nutritional analysis tool. The app provides essential calorie counting features for users focused on weight management while offering deeper nutritional insights for those interested in holistic wellness.

Key components include:

- Simple, fast calorie tracking with AI photo recognition (core functionality)
- Optional in-depth nutritional analysis and education (premium features)
- Personalized onboarding flow with scalable assessment options
- AI-powered food photo recognition with detailed nutritional breakdown
- Premium nutritional insights with micronutrient analysis
- Health app integration for activity tracking
- Educational content on nutritional science (premium tier)
- Subscription model with calorie tracking in free tier
- Studio Ghibli-inspired visual aesthetic with nature-themed elements
- Scientific credibility with proper disclaimer system

The app will leverage Google AI API for photo analysis and LLM-powered features, strategically cycling through free tier Google models if one is rate limited, starting with the best models (currently Gemini 2.5 Pro) and working downwards.

## GOOGLE AI MODEL INFORMATION

Model tiers and limitations to consider when building features:

### Gemini 2.5 Pro Experimental

- Free tier available: Yes, use "gemini-2.5-pro-exp-03-25"
- Input limits: Free of charge
- Output limits: Free of charge
- Context window: Extended
- Best for: Complex, multimodal reasoning tasks

### Gemini 2.0 Flash

- Free tier available: Yes
- Input pricing: Free of charge (text/image/video)
- Output pricing: Free of charge
- Context caching: Free, up to 1,000,000 tokens of storage per hour
- Best for: Balanced performance across all tasks with 1M token context window

### Gemini 2.0 Flash-Lite

- Free tier available: Yes
- Input pricing: Free of charge
- Output pricing: Free of charge
- Best for: Cost-effective, at-scale usage with smaller resource requirements

The following prompts are designed to guide the development of a functionally robust application using Cursor IDE. The app will replicate Cal AI's proven subscription model and UX flow while incorporating subtle visual distinctions through Studio Ghibli-inspired aesthetic elements.

## PROMPT 1: INITIAL APP GENERATION

```
Create a cross-platform mobile app called "Nutri AI" that functions as an AI-powered calorie and nutrition tracking system. The app should have the following core features:

1. WELCOME & SIGNUP FLOW:
- Initial welcome screen with:
  * App dashboard preview showing calorie/macro tracking interface
  * "Calorie tracking made easy" tagline
  * "Get Started" primary button
  * "Purchased on the web? Sign In" text link at bottom
  * Clean, minimalist UI with device framing
  * Today/Yesterday toggle in preview

2. ONBOARDING SEQUENCE (post-signup):
- Welcome screen with "Welcome to Nutri AI" headline and "Let's create your plan" subtitle
- Gender selection screen with Male/Female/Other options
- Workout frequency selection (0-2, 3-5, 6+) with descriptive text:
  * "0-2: Workouts now and then"
  * "3-5: A few workouts per week"
  * "6+: Dedicated athlete"
- "Where did you hear about us?" attribution tracking screen:
  * Single scrollable screen with options like Instagram, Facebook, TikTok, etc.
  * Light gray selection buttons with rounded corners
  * No pagination or multiple screens - just vertical scrolling for options
- Height and weight input with toggle between Imperial/Metric systems
  * Height input with feet/inches or cm
  * Weight input with lbs or kg
  * Unit system toggle at top of form
- Birthdate selection with month/day/year pickers
  * Month dropdown
  * Day dropdown
  * Year dropdown
  * Birthday cake icon
- Goal selection screen ("What's your goal?"):
  * Lose weight option
  * Maintain weight option
  * Gain weight option
  * Each option has description text
- Diet type selection with options:
  * Regular (No restrictions, includes all food groups)
  * Pescatarian (Vegetarian diet that includes fish and seafood)
  * Vegetarian (No meat or fish, but includes dairy and eggs)
  * Vegan (No animal products, including meat, fish, dairy, and eggs)
- Referral code entry screen (optional with skip option)
- Plan calculation screen with progress visualization
  * Percentage indicator (e.g., "44%")
  * "We're setting everything up for you" message
  * Progress bar showing calculation status
  * "Applying BMR formula..." status message
  * Checkmarks for completed calculations
- Plan completion screen
  * Success checkmark icon
  * "Congratulations your custom plan is ready!" headline
  * Target weight maintenance message
  * Daily calorie and macro recommendations in circular indicators
  * "Let's get started!" button
- Health app connection screen (optional)
  * Activity icons (walking, running, etc.)
  * Health app logo (Apple Health or Google Fit)
  * Connection visualization with arrows
  * "Continue" and "Not now" options
- Notification permission request
  * Clear explanation of benefits
  * Native permission dialog
- Progress indicator showing completion percentage at top of each screen
- Back button on all screens (left-aligned circle with arrow)
- Continue button at bottom of each screen

3. MAIN DASHBOARD:
- Clean, minimalist UI with black (#000000) and white (#FFFFFF) as primary colors
- Large calorie counter at top showing calories left for the day (e.g., "2199")
- "Calories left" label beneath counter
- Macro tracking cards showing protein, carbs, and fat remaining in grams (e.g., "161g")
- Recently eaten section with food photo and processing status
- Processing indicator ("Finalizing results...") with "We'll notify you when done!" text
- Bottom navigation with Home, Analytics, and Settings tabs
- Floating action button (+) for adding new entries
- Today/Yesterday toggle at top

4. PHOTO FOOD RECOGNITION:
- Camera integration with food-focusing overlay
- AI-powered visual recognition of food items in photos using Google's AI models
- Multiple food detection in single images
- Portion size estimation using depth sensors when available
- Processing status indicator during analysis
- Nutritional calculation showing calories, protein, carbs, and fat
- User correction interface for adjusting AI recognition results

5. CALORIE MANAGEMENT FEATURES:
- Option to add calories burned from exercise back to daily goal
- Calorie rollover feature to transfer unused calories to next day (with customizable limit)
- Visual display comparing yesterday's and today's consumption
- Daily calorie goal calculation based on all input metrics
- Progress visualization using circular indicators

6. TECHNICAL REQUIREMENTS:
- Cross-platform (iOS and Android)
- Built with React Native or Flutter for cross-platform compatibility
- Support for iOS 16+ and Android 12+ for app store approval
- Apple Health integration on iOS
- Google Fit integration on Android
- Offline capability for basic logging
- User authentication and data synchronization
- Secure handling of health data
- Meet all Apple App Store Review Guidelines (latest version)
- Comply with Google Play Store policy requirements (latest version)

Please generate a clean, modern interface with a minimalist design aesthetic using primarily black text on white backgrounds. Use circular progress indicators for visualizing remaining calories and macros.
```

## PROMPT 2: SUBSCRIPTION & FREE TRIAL IMPLEMENTATION

```
For the Nutri AI app, implement a comprehensive subscription model and free trial flow based on leading nutrition app implementations. Include the following components:

1. FREE TRIAL IMPLEMENTATION:
- Create attractive trial offer screens:
  a) "We want you to try Nutri AI for free" headline
  b) App dashboard preview image showing interface
  c) "No Payment Due Now" reassurance text
  d) Primary "Try for $0.00" button
  e) Secondary pricing information: "Just $29.99 per year ($2.49/mo)"
  f) Clean, minimalist design with ample white space
- Trial reminder features:
  a) "We'll send you a reminder before your free trial ends" screen
  b) Bell notification icon with red badge (1)
  c) "No Payment Due Now" reassurance text
  d) "Continue for FREE" button
  e) Annual pricing note beneath
- 3-day free trial timeline:
  a) Timeline visualization showing Today → Reminder (2 days)
  b) "Start your 3-day FREE trial to continue" headline
  c) Orange unlock icon with "Today" label
  d) Notification bell icon for "In 2 Days - Reminder"
  e) Clear value proposition: "Unlock all the app's features like AI calorie scanning and more"

2. SUBSCRIPTION OPTIONS:
- Implement subscription selection:
  a) Monthly ($9.99/mo) in gray, unselected state
  b) Yearly ($2.49/mo) in white with checkmark, pre-selected
  c) 3 DAYS FREE label on yearly option
  d) "No Payment Due Now" reassurance below options
  e) "Start My 3-Day Free Trial" primary button
- Special offer implementation:
  a) "One Time Offer" modal with "You will never see this again" urgency text
  b) Gift icon and confetti animation
  c) "Here's a 80% off discount" headline with party emoji
  d) "Only $1.66 / month" prominent discount price
  e) "Lowest price ever" supporting text
- App restore functionality:
  a) "Restore" text link in top-right corner of subscription screens
  b) Easy access to restore previous purchases
- Ensure compliance with App Store and Google Play Store guidelines:
  a) Include "Manage Subscription" option in settings
  b) Clear disclosure of subscription terms
  c) Prominent display of privacy policy and terms of service
  d) Support for Apple's StoreKit 2 and Google Play Billing Library 5.0+

3. PLAN CALCULATION FLOW:
- Create calculation screen:
  a) Percentage completion indicator (e.g., "44%")
  b) "We're setting everything up for you" message
  c) Color gradient progress bar
  d) "Applying BMR formula..." status text
  e) "Daily recommendation for" heading with bulleted list
  f) Check marks next to completed items (Calories, Carbs, Protein, Fats, Health Score)
- Completion announcement:
  a) Checkmark icon in black circle
  b) "Congratulations your custom plan is ready!" heading
  c) "You should maintain: 54 kg" recommendation
  d) "Daily recommendation" section with "You can edit this anytime" subtext
  e) Circular indicators for calorie (1747) and macro targets (e.g., 207g carbs)
  f) "Let's get started!" action button

4. REFERRAL SYSTEM:
- Implement referral code screen:
  a) "Do you have a referral code?" heading
  b) "You can skip this step." small text
  c) Text input field for code entry
  d) Consistent Continue button

5. NOTIFICATION PERMISSION:
- Create permissions request:
  a) "Reach your goals with notifications" heading
  b) Native permission dialog showing "Nutri AI would like to send you Notifications"
  c) "Don't Allow" and "Allow" options
  d) Finger pointer emoji indicating preferred choice
  e) Clean layout consistent with other screens

Please implement these subscription screens with an educational value proposition rather than feature restriction. The design should emphasize the nutritional journey and learning aspects, using the Studio Ghibli-inspired aesthetic with organic animations and nature elements to create an emotional connection to nutritional wellness.
```

## PROMPT 3: HEALTH APP INTEGRATION

```
For the Nutri AI app, I need to implement health app integration for both iOS and Android platforms. Create a seamless health app connection experience that allows activity data synchronization.

Please implement the following functionality:

1. HEALTH INTEGRATION SCREEN:
- Create a visually appealing integration screen showing:
  * Walking, Running, Heart Rate activity icons
  * Apple Health / Google Fit app icons
  * Connection visualized with arrows between activity types and health apps
  * Clear "Connect to..." heading with explanatory text
  * Primary "Continue" button
  * Secondary "Not now" text option
  * Clean, minimalist design matching onboarding screens

2. iOS HEALTHKIT INTEGRATION:
- Request appropriate permissions to read/write health data
- Use HealthKit framework (latest version for iOS 16+)
- Read data from Apple Health:
  a) Activity data (steps, workouts, energy expenditure)
  b) Weight measurements and history
  c) Heart rate data
  d) Sleep metrics
- Write data to Apple Health:
  a) Nutrition information (calories, protein, carbs, fat)
  b) Water intake
  c) Weight updates
- Handle background synchronization
- Support privacy-focused permission handling
- Implement proper entitlements in app configuration

3. ANDROID GOOGLE FIT INTEGRATION:
- Implement Google Fit API connection (latest version)
- Support Android Health Connect API for Android 13+
- Read data from Google Fit:
  a) Activity data (steps, workouts)
  b) Weight measurements
  c) Sleep data if available
- Write data to Google Fit:
  a) Nutrition information
  b) Water intake
  c) Weight updates
- Ensure proper authentication flow
- Support runtime permissions for health data
- Handle graceful degradation for older Android versions

4. ACTIVITY CALORIE ADJUSTMENT:
- Create a dedicated screen for activity calorie adjustments showing:
  * Today's calorie goal clearly displayed
  * Activity type (e.g., Running) with icon
  * Calories burned from activity (+100 cals)
  * Visual representation (athlete image)
  * Yes/No buttons for adding calories back to daily goal
  * Clean black and white design with minimal UI elements

5. CALORIE ROLLOVER FEATURE:
- Implement a calorie rollover screen showing:
  * Clear heading "Rollover extra calories to the next day?"
  * Rollover limit indicator (e.g., "Rollover up to 200 cals")
  * Yesterday's consumption (350/500) with progress indicator
  * Today's adjusted goal (350/650) with visual indicator of rollover (+150)
  * Yes/No buttons for enabling the feature
  * Circular progress indicators for both days

6. PRIVACY CONTROLS:
- Implement granular permission controls for health data sharing
- Provide clear explanations of data usage
- Include options to delete synchronized data
- Ensure compliance with health data regulations (HIPAA where applicable)
- Support for privacy manifests on iOS 17+
- Implement data transparency reports for Android
- Clear opt-out mechanisms for health data collection

Please implement this with error handling for devices that don't have health platforms available, and ensure the integration appears as a natural part of the onboarding flow rather than a technical configuration step.
```

## PROMPT 4: STRATEGIC VISUAL DIFFERENTIATION

```
For the Nutri AI app, implement strategic visual differentiation that maintains Cal AI's proven functional layout while incorporating distinctive design elements inspired by Studio Ghibli and current design trends. Create the following visual modifications:

1. DISTINCTIVE COLOR PALETTE:
- Modify Cal AI's color scheme while maintaining functional clarity:
  a) Primary backgrounds: #F8F5F0 (warm cream) instead of pure white
  b) Text: #393939 (soft charcoal) instead of pure black
  c) Accent colors:
     - Macronutrient indicators: Same positions but with Studio Ghibli-inspired palette
       * Protein: #D67B56 (earthy terracotta) instead of red
       * Carbs: #7C9A6F (forest green) instead of orange
       * Fat: #8AADC1 (muted blue) instead of blue
     - Progress bars: Subtle watercolor-style gradients
     - Active elements: #D98C5F (warm amber) instead of black
  d) Secondary UI elements: #F0EBE2 (light parchment) instead of light gray
  e) Keep alert colors (red notifications) and success indicators (green checkmarks) the same

2. SUBTLE TEXTURE AND VISUAL ELEMENTS:
- Add subtle Studio Ghibli-inspired elements:
  a) Very light watercolor-style texture on card backgrounds (5-10% opacity)
  b) Slightly rounded corners (20px instead of 16px) for a softer feel
  c) Subtle hand-drawn quality to icons (maintain same positions and functions)
  d) Gentle drop shadows with warm undertones (instead of neutral gray)
  e) Delicate organic patterns in background elements (almost imperceptible)
  f) Maintain exact same layout, sizing, and positioning of all elements

2. ONBOARDING SCREENS:
- Consistent layout for all onboarding screens:
  a) Back button (left-aligned circle with arrow)
  b) Progress bar beneath header
  c) Large bold heading (28pt)
  d) Subheading/explanation text (16pt, gray)
  e) Option buttons with 12dp rounded corners
  f) Full-width "Continue" button at bottom
- Selection buttons:
  a) Light gray (#F5F5F5) background
  b) Black text with optional icon
  c) 16dp padding on all sides
  d) Full width of container

3. TYPOGRAPHY AND INTERACTIVE ELEMENTS:
- Implement subtle typography changes:
  a) Primary font: San Francisco (iOS) / Roboto (Android) with slightly increased letter spacing (0.2px)
  b) Headings: Same size/weight but with 1px increased line height
  c) Button text: Same size but with subtle animation on press (slight scale change)
  d) Labels: Same position/size with 5% increased spacing between elements
  e) Numerical displays: Same positioning with subtle glow effect on changes
- Interactive element modifications:
  a) Buttons: Same size/position but with gentle gradient
  b) Toggles: Same functionality with slightly more organic shape
  c) Input fields: Same size with subtle texture on active state
  d) Selection indicators: Same positioning with soft animation
  e) Maintain identical touch target sizes and spacing for usability

4. GHIBLI-INSPIRED ICONOGRAPHY:
- Replace standard icons with Ghibli-inspired alternatives:
  a) Food icons: Hand-drawn style (like Totoro's acorn or Spirited Away food)
  b) Navigation icons: Same positions but with natural elements integrated:
     - Home icon with tiny house resembling countryside cottage
     - Profile icon with gentle human silhouette
     - Settings icon with organic gear shape
  c) Progress indicators: Add subtle natural elements (tiny leaf decorations)
  d) Notification bell: Same function but with wind-chime aesthetic
  e) Calendar elements: Same functionality with nature-inspired decorative elements
  f) Maintain identical positioning, recognition, and tap targets

5. ANIMATION AND TRANSITION STYLING:
- Implement subtle animation differences:
  a) Page transitions: Gentle fade rather than slide
  b) Button presses: Soft pulse effect instead of flat highlight
  c) Loading indicators: Watercolor-style spreading animation
  d) Success states: Gentle particle effects resembling dust sprites
  e) Error states: Same positioning but with organic movement
  f) Progress updates: Gentle ripple effect when values change
  g) Keep all animations under 300ms for performance

6. ANIMATIONS AND TRANSITIONS:
- Subtle slide transitions between onboarding screens
- Fade animations for selection highlights
- Progress indicators for processing actions
- Smooth transitions for calorie and macro updates
- Spring physics for interactive elements
- Support for reduced motion accessibility settings
- Hardware acceleration for smooth performance

Please implement this consistent, minimalist design system across all screens of the application, ensuring the look and feel matches the provided screenshots while maintaining excellent usability.
```

## PROMPT 5: BALANCED SUBSCRIPTION MODEL & MANDATORY TRIAL

```
For Nutri AI, implement an identical subscription model to Cal AI with a mandatory trial period that converts to paid subscription. This approach ensures no completely free usage while maintaining conversion tactics:

1. MANDATORY SUBSCRIPTION FLOW:
- Implement Cal AI's exact payment model:
  a) Free trial requiring payment method upfront
  b) No option to use app without entering payment flow
  c) Annual subscription ($29.99/year) automatically starts after trial
  d) Monthly option ($9.99/month) available but visually de-emphasized
  e) No persistent free tier - all users must subscribe after trial
  f) Strategically placed "Restore" option in top corner for returning users
  g) Full compliance with App Store/Google Play requirements

2. STRATEGIC TRIAL IMPLEMENTATION:
- Copy Cal AI's free trial sequencing:
  a) Trigger trial offer immediately after custom plan creation
  b) "We want you to try Nutri AI for free" headline
  c) App dashboard preview showing calories/macros interface
  d) "No Payment Due Now" reassurance with checkmark
  e) "Try for $0.00" primary button
  f) "$29.99 per year ($2.49/mo)" pricing below
  g) No option to skip payment flow - required for app access

3. DISCOUNT OFFER TRIGGERS:
- Implement strategic discount timing:
  a) Show "One Time Offer" only after user reviews custom plan
  b) Trigger discount when user attempts to navigate away from payment
  c) Create urgency with "You will never see this again" messaging
  d) Show "80% off" discount with party emoji and gift icon
  e) Display "Only $1.66 / month" prominently with confetti animation
  f) Add "Lowest price ever" supporting text
  g) Implement purchase conversion tracking

2. BALANCED ONBOARDING EXPERIENCE:
- Implement adaptive onboarding flow:
  a) Quick start option for calorie tracking focused users:
     - Minimal required questions (height, weight, goal)
     - Skip optional nutritional questions
     - Immediate access to calorie tracking dashboard
     - "Upgrade later" reassurance messaging
  b) Comprehensive option for nutrition-focused users:
     - Expanded health assessment
     - Dietary preferences and restrictions
     - Nutritional goals beyond weight management
     - Educational content introduction
  c) Clear path selection at start:
     - "I just want to track calories" quick option
     - "I want nutritional guidance" comprehensive option
- Add social proof with dual messaging:
  a) "Join 2M+ people tracking their calories with Nutri AI"
  b) "The smarter way to understand your nutrition"
  c) Avatar images representing diverse user goals
  d) Testimonials showcasing both simple tracking and nutritional insights

3. FLEXIBLE RESULTS VISUALIZATION:
- Create adaptive dashboard based on user preference:
  a) Calorie-focused view with simplified interface:
     - Prominent calorie counter
     - Basic macro tracking
     - Recent meals list
     - Quick add buttons for common foods
  b) Nutrition-focused view with detailed insights:
     - Nutritional balance visualization
     - Micronutrient tracking
     - Meal quality assessment
     - Educational tooltips
  c) Easy toggle between views to encourage exploration
  d) Studio Ghibli-inspired aesthetics that work for both modes

4. GOAL-BASED PERSONALIZATION:
- Implement "What are you looking to achieve?" screen with clear options:
  a) "Lose weight" (scale icon with downward arrow)
  b) "Maintain weight" (balanced scale icon)
  c) "Gain weight" (scale icon with upward arrow)
  d) "Improve nutrition" (plate with diverse foods icon)
  e) "Track health conditions" (heart/medical icon)
- Add "How would you like to use Nutri AI?" screen with approachable options:
  a) "Just count my calories" (simple counter icon)
  b) "Track my macros" (basic nutrition label icon)
  c) "Learn about nutrition" (book/education icon)
  d) "Get personalized guidance" (customized plate icon)
  e) "All of the above" (comprehensive option)

5. INCLUSIVE FEEDBACK SYSTEM:
- Create feedback screen with dual messaging:
  a) "How's your experience tracking calories with Nutri AI?"
  b) Simplified star rating system with emoji indicators
  c) Optional feedback field for detailed input
  d) Focus on app usability and tracking accuracy
  e) Timing tied to successful actions (meal logging, goal progress)
- Implement targeted improvement surveys:
  a) Feature-specific feedback for used components
  b) Skip rarely used premium features for free tier users
  c) Photo recognition accuracy feedback after scanning
  d) Easy dismiss option that doesn't disrupt experience

6. SCIENTIFIC CREDIBILITY & MEDICAL DISCLAIMERS:
- Incorporate Cal AI's exact approach to scientific references:
  a) Plan completion screen showing:
     - "How to reach your goals:" section with icons and instructions
     - Heart icon for health scores
     - Avocado icon for food tracking
     - Circle icon for calorie recommendations
     - Colored circles for macro balance
  b) Scientific credibility elements:
     - "Plan based on the following sources, among other peer-reviewed medical studies:" text
     - Bulleted list matching Cal AI's sources:
       * "Basal metabolic rate" (as clickable link)
       * "Calorie counting - Harvard" (as clickable link)
       * "International Society of Sports Nutrition" (as clickable link)
       * "National Institutes of Health" (as clickable link)
  c) Medical disclaimer implementation:
     - Explicit "Not medical advice" statements
     - "For informational purposes only" labels
     - "Consult healthcare provider" advisory
     - Terms of service with comprehensive disclaimers
     - Required user acknowledgment of non-medical nature

Please implement these engagement and monetization features throughout the user journey while maintaining the clean, minimalist aesthetic shown in the screenshots. Focus on value proposition rather than limitations, and ensure all conversion points feel like natural parts of the user experience.
```

## PROMPT 6: OPTIMIZED BACKEND FOR DIGITAL OCEAN BASIC TIER

```
For the Nutri AI app, design and implement a highly optimized backend infrastructure specifically tuned for Digital Ocean's basic tier droplet while ensuring easy scalability as user base grows. The implementation should be resource-efficient and coexist with other services on the existing droplet:

1. RESOURCE-OPTIMIZED AI PIPELINE:
- Create an efficient food analysis system:
  a) Pre-processing image optimization to reduce bandwidth/storage requirements
  b) Multi-tiered model approach:
     - Lightweight local model for basic food identification (runs on device)
     - Server model for detailed nutritional analysis (with caching)
     - Full API calls to Google AI only for unrecognized or complex foods
  c) Aggressive caching strategy:
     - User-specific food recognition memory
     - Global common food database with nutritional profiles
     - Time-based cache invalidation for rarely accessed items
  d) Batch processing for non-time-sensitive operations
  e) Compression for all data transfers
- Implement resource-conscious Google AI API integration:
  a) Primary usage of Gemini 2.5 Pro Experimental models for complex recognition
  b) Automatic downscaling to Gemini 2.0 Flash for simpler tasks
  c) Further downscaling to Gemini 2.0 Flash-Lite during high load periods
  d) Request throttling system to stay within free tier limits
  e) Fallback to local database for common foods during API outages

2. DIGITAL OCEAN BASIC TIER OPTIMIZATION:
- Implement lightweight infrastructure tailored to basic droplet:
  a) Resource monitoring with automatic throttling during peak loads
  b) Background task scheduling during low-usage periods
  c) Memory-efficient database design with proper indexing
  d) Incremental backup system to minimize storage impact
  e) Horizontal scaling preparation for easy transition to larger droplets
  f) Containerized architecture with resource limits
  g) Redundancy only for critical components
  h) Cold storage for infrequently accessed data

3. CONTAINERIZED DEPLOYMENT ON SHARED DROPLET:
- Setup isolated containers with resource limits:
  a) Nginx container for reverse proxy with minimal footprint
  b) API server with automatic scaling based on load
  c) Database container with connection pooling and query optimization
  d) Redis for session management and caching with memory limits
  e) Scheduled tasks container for background processing
  f) Monitoring container with minimal overhead
- Configure seamless integration with existing droplet:
  a) Namespace isolation to prevent conflicts
  b) Resource quotas to prevent service disruption
  c) Shared SSL certificate management
  d) Network isolation with defined ingress/egress

4. SUBSCRIPTION MANAGEMENT:
- Implement subscription backend:
  a) Trial management with expiration tracking
  b) Receipt validation for App Store/Google Play purchases
  c) Subscription status verification
  d) Special offer eligibility checking
  e) Restore purchase functionality
  f) Subscription analytics for conversion tracking

5. SECURITY & COMPLIANCE:
- Implement data protection measures:
  a) End-to-end encryption for sensitive health data
  b) GDPR and CCPA compliance mechanisms
  c) Data minimization practices
  d) User-controlled data deletion
  e) Privacy-focused analytics
- Meet platform-specific requirements:
  a) App Attest API for iOS security
  b) Play Integrity API for Android
  c) Implement App Store Server API
  d) Support for Google Play Console App Signing

Please implement this backend structure to support the key features shown in the app. The AI infrastructure should emphasize accuracy and speed for the food recognition pipeline, while optimizing Google AI API usage within free tier limits. The nutritional recommendation system should generate personalized, scientifically-sound guidance.
```

## PROMPT 7: SCIENTIFIC REFERENCES & GOAL VISUALIZATION

```
For the Nutri AI app, implement Cal AI's identical approach to scientific credibility and goal visualization, creating the same screens and references. Develop the following elements:

1. GOALS SCREEN IMPLEMENTATION:
- Create exact replica of Cal AI's "How to reach your goals:" screen:
  a) Light gray card background with white individual rows
  b) Four key action items with identical icons:
     - Heart icon with "Use health scores to improve your routine" text
     - Avocado icon with "Track your food" instruction
     - Circular progress indicator with "Follow your daily calorie recommendation"
     - Colored circles (orange, red, blue) with "Balance your carbs, proteins, and fat" advice
  c) Clean, minimalist layout with generous white space
  d) Left-aligned icons with right-aligned text
  e) Back button in top left corner
  f) Progress bar at top of screen showing completion percentage

2. SCIENTIFIC REFERENCES IMPLEMENTATION:
- Implement identical scientific sources section:
  a) "Plan based on the following sources, among other peer-reviewed medical studies:" text
  b) Bulleted list with exact sources as Cal AI:
     - "Basal metabolic rate" as clickable link
     - "Calorie counting - Harvard" as clickable link
     - "International Society of Sports Nutrition" as clickable link
     - "National Institutes of Health" as clickable link
  c) Position below goal recommendations card
  d) Simple bullet formatting with underlined links
  e) Leading dot bullet style
  f) "Let's get started!" button below sources list

3. CALL-TO-ACTION & BUTTON IMPLEMENTATION:
- Create identical primary action buttons:
  a) "Let's get started!" black button with white text
  b) Full width button with 16dp radius rounded corners
  c) Positioned at bottom of scientific sources screen
  d) Same button on plan completion screen
  e) Consistent styling across all primary actions
  f) Clear visual hierarchy emphasizing primary action
  g) Haptic feedback on button press (subtle vibration)

4. DOCUMENT LINKING IMPLEMENTATION:
- Create identical document linking system:
  a) Each scientific source as clickable underlined text
  b) Links open appropriate external scientific sources
  c) Maintain consistent blue link color for all text links
  d) Support for deep linking to specific content
  e) Browser handling for external links
  f) PDF download option for scientific papers
  g) Citation tracking for regulatory compliance

5. PLAN COMPLETION SEQUENCE:
- Create identical completion sequence:
  a) Show plan calculation progress screen first:
     - Progress percentage indicator
     - "We're setting everything up for you" message
     - Processing indicators for each calculation step
     - "Daily recommendation for..." heading with calculations
  b) Then show completion screen with:
     - Black circle with white checkmark
     - "Congratulations your custom plan is ready!" headline
     - "You should maintain: 54 kg" (or user's target)
     - "Daily recommendation" with "You can edit this anytime" subtext
     - Calorie and macros in circular progress indicators
     - "Let's get started!" button leading directly to payment flow
  c) Immediate transition to payment flow:
     - No option to skip payment screens
     - Free trial offer as first payment screen
     - Full subscription flow required to continue

Please implement these strategic visual modifications that maintain Cal AI's proven functional layout while adding subtle Studio Ghibli-inspired elements. These changes should be just distinctive enough for App Store approval while preserving the market-validated user experience that drives conversion.
```

## PROMPT 8: OPTIMIZED FOOD ANALYSIS WITH DISTINCTIVE VISUALS

```
For the Nutri AI app, implement an optimized food analysis system with distinctive Ghibli-inspired visuals that maintain Cal AI's proven functional layout. This dual approach should preserve the effective user experience while adding just enough visual distinction for App Store approval.

Please design and implement the following components:

1. FUNCTIONAL CAMERA INTERFACE WITH GHIBLI TOUCHES:
- Create a camera implementation that maintains Cal AI's functionality:
  a) Same food framing guides but with subtle hand-drawn quality to corners
  b) Same capture button position but with gentle watercolor glow effect
  c) Same instructional overlays with slightly warmer typography
  d) Same clean UI with hint of parchment texture (5% opacity)
  e) Same quick access elements with subtle organic styling
- Implement identical image capture functionality:
  a) Still image capture from live camera feed
  b) Photo library access option
  c) Flash toggle option
  d) Front/back camera switching
- Support latest device capabilities efficiently:
  a) Camera permission handling with clear purpose explanation
  b) Selective use of advanced camera features based on device capability
  c) Graceful degradation on older devices

2. VISUALLY DISTINCTIVE FOOD RECOGNITION:
- Create recognizable processing state with Ghibli-inspired elements:
  a) Same "Finalizing results..." text with warmer, hand-drawn font style
  b) Same circular progress indicator with gentle watercolor effect
  c) Same "We'll notify you when done!" message with subtle animation
  d) Same positioning and functional elements with organic styling
  e) Maintain identical processing notification flow
- Implement identical AI processing pipeline using Google AI API:
  a) Same image optimization for API submission
  b) Same primary use of Gemini 2.5 Pro Experimental
  c) Same fallback strategy to Gemini 2.0 Flash
  d) Same strategic distribution of API calls
  e) Same local caching of common food recognitions

3. RESULTS DISPLAY WITH GHIBLI AESTHETIC:
- Implement food recognition results with subtle visual changes:
  a) Same food items list with gentle organic styling for cards
  b) Same calorie count display with warm parchment background
  c) Same macro breakdown with Studio Ghibli color palette
  d) Same editing interface with slightly more organic buttons
  e) Same functionality with subtle nature-inspired decorative elements
- Support identical result correction:
  a) Same manual food item addition with styled input fields
  b) Same portion size adjustment with organic slider styling
  c) Same deletion functionality with gentle animation effects
  d) Same feedback mechanism with nature-inspired visual feedback
  e) Maintain identical interaction patterns and touch targets

4. SCANNING PROMOTION:
- Create scanning feature promotion:
  a) "We want you to try Nutri AI for free" promotional screen
  b) Image of camera view with food (sandwich and chips)
  c) "No Payment Due Now" reassurance text
  d) "Try for $0.00" primary action button
  e) Yearly subscription price ($29.99) shown below

5. TECHNICAL IMPLEMENTATION:
- Implement model pipeline for food recognition:
  a) Image preprocessing for optimization
  b) Food identification and segmentation
  c) Nutritional database lookup
  d) Result caching for repeated foods
- Handle various food photography challenges:
  a) Poor lighting conditions
  b) Mixed food items on plate
  c) Ambiguous portion sizes
  d) Unknown or custom foods
- Support offline mode:
  a) Queue recognition requests when offline
  b) Process when connection is restored
  c) Basic manual entry always available

Please ensure the interface is intuitive and the processing flow feels fast and responsive. The photo scanning feature should be positioned as the premium feature that drives subscription conversion, with appropriate hooks into the subscription flow. Optimize the Google AI API usage within free tier limitations.
```

## PROMPT 9: FINAL INTEGRATION & DEPLOYMENT

```
For the Nutri AI app, implement the final integration and deployment strategy based on the implementation. Connect all the previously developed components into a cohesive, production-ready application.

1. COMPONENT INTEGRATION:
- Connect all UI flows seamlessly:
  a) Onboarding → BMR calculation → Plan creation → Dashboard → Food logging
  b) Dashboard → Subscription upsell → Free trial → Payment → Premium features
  c) Food logging → Photo scanning → Results display → Food diary entry
  d) Health app connection → Activity data → Calorie adjustment → Updated goals
- Implement consistent state management:
  a) User profile and preferences
  b) Subscription status and trial period
  c) Daily food log and nutrition totals
  d) Health metrics and goal progress

2. USER EXPERIENCE OPTIMIZATION:
- Implement smooth transitions between screens:
  a) Subtle animation for screen changes
  b) Loading states with progress indicators
  c) Skeleton screens for data loading
  d) Transition animations for modal displays
- Optimize performance:
  a) App startup time under 2 seconds
  b) Photo processing response within 3 seconds
  c) UI thread optimization for 60fps scrolling
  d) Battery usage optimization for all-day use
- Support for latest platform features:
  a) iOS 16+ and Android 12+ compatibility
  b) Dynamic Island support for iPhone Pro models
  c) Material You design integration for Android 12+
  d) Adaptive layouts for folding devices

3. COMPREHENSIVE TESTING:
- Implement test suite for critical paths:
  a) Onboarding flow verification
  b) Subscription purchase and restoration
  c) Photo recognition accuracy validation
  d) Notification delivery confirmation
  e) Health app data synchronization
- Platform-specific testing:
  a) iOS-specific features (Apple Health, StoreKit)
  b) Android-specific features (Google Fit, Billing)
  c) Device-specific optimizations (notch, different screen sizes)
  d) OS version compatibility testing

4. ANALYTICS & MONITORING:
- Implement analytics tracking:
  a) Onboarding completion rate
  b) Feature usage frequency (photo scanning, manual logging)
  c) Subscription conversion funnel
  d) User retention metrics
  e) Feature adoption rates
- Setup crash and performance monitoring:
  a) Error reporting and crash analytics
  b) Performance metrics for key operations
  c) Network request monitoring
  d) Battery and memory usage tracking

5. APP STORE PREPARATION:
- Create compelling store listings:
  a) App description highlighting AI food scanning
  b) Feature screenshots showcasing clean interface
  c) Preview video of the photo scanning process
  d) Keyword optimization for discoverability
- Implement in-app review prompts:
  a) "Give us a rating" screen after successful usage
  b) Five-star rating interface with gold stars
  c) User testimonial display
  d) Strategic timing after positive experiences
- Ensure compliance with latest store guidelines:
  a) Apple App Store Review Guidelines (latest version)
  b) Google Play Store Policy Requirements (latest version)
  c) Data safety section for Google Play
  d) App privacy details for App Store

6. RELEASE STRATEGY:
- Implement phased rollout:
  a) Internal testing with team members
  b) Closed beta with select users
  c) Public beta with limited audience
  d) Full production release
- Post-launch monitoring and iteration:
  a) User feedback collection
  b) Performance monitoring
  c) Conversion rate optimization
  d) Regular feature updates
- Support for over-the-air updates:
  a) Feature flags for gradual rollout
  b) A/B testing infrastructure
  c) Remote configuration

Please integrate all components into a cohesive application that matches the polish and user experience seen in the app. Focus on seamless connections between features and ensure the user flow feels intuitive throughout all interactions with the app.
```

## DEVELOPMENT INSTRUCTIONS

When developing the app with Cursor IDE:

1. Use Cursor IDE with Claude 3.7 model in thinking mode for optimal development
2. Start with the initial app structure following the first prompt
3. Develop incrementally, adding features in the order presented
4. Use the Google AI API for implementing the photo analysis and LLM features
5. Strategically implement API usage to maximize free tier limits
6. Test thoroughly on both iOS and Android to ensure cross-platform compatibility
7. Ensure compliance with latest App Store and Google Play Store requirements

## CONCLUSION

This prompt document provides a comprehensive roadmap for building Nutri AI, a strategic variation of Cal AI that maintains the proven subscription model, user flow, and functionality while incorporating subtle Studio Ghibli-inspired visual elements for App Store differentiation. The app achieves market viability through:

1. **Identical Revenue Model**: Preserving Cal AI's exact subscription flow with mandatory trial-to-paid conversion
2. **Strategic Visual Differentiation**: Implementing subtle Ghibli-inspired visual elements without changing functional layout
3. **Digital Ocean Optimization**: Maintaining efficient resource usage optimized for basic tier deployment
4. **Conversion-Optimized Flow**: Following Cal AI's proven sequence while adding visual distinctiveness
5. **Identical Pricing Strategy**: Maintaining exact pricing model ($29.99/year or $9.99/month) with strategic discounting ($1.66/month)
6. **Familiar UX with Visual Identity**: Preserving all functional layouts, interactions, and flows while adding subtle visual styling
7. **Consistent Premium Value**: Focusing on the same AI-powered food recognition as the core value proposition
8. **Technical Architecture Preservation**: Maintaining all backend optimizations while adding visual distinctiveness to frontend elements

The app strategically balances maintaining Cal AI's proven model with adding just enough visual differentiation to satisfy App Store approval requirements. The approach preserves all functional behaviors, interaction patterns, and conversion tactics while introducing a distinctive visual identity through color palette, subtle textures, and organic styling inspired by Studio Ghibli aesthetics.

For App Store approval, this strategic differentiation through visual styling rather than functional changes presents the optimal balance between market-validated patterns and distinctive identity. The careful preservation of all functional elements and flows ensures the app maintains the conversion effectiveness of Cal AI while establishing its own visual brand identity through the Studio Ghibli-inspired aesthetics.

This approach enables efficient market entry with minimal development risks while addressing potential App Store rejection concerns through strategic visual differentiation rather than functional changes.
