# NUTRI AI AGENT INSTRUCTION GUIDE

## INTRODUCTION

This document provides structured guidance for AI agents building the Nutri AI application. It breaks down the implementation steps for each major feature while applying the hyper-rational software engineering approach. The goal is to develop a premium AI-powered nutrition tracking app based on the specifications in the PRD, with Studio Ghibli-inspired visual elements that differentiate it from Cal AI.

## CORE PRINCIPLES

When implementing each feature, adhere to these hyper-rational software engineering principles:

1. **DECONSTRUCTION**

   - Break features into foundational units
   - Challenge assumptions in the PRD
   - Map dependencies between components
   - Identify leverage points for optimal implementation

2. **SOLUTION ENGINEERING**

   - Design for resource efficiency
   - Prioritize user-facing features by impact
   - Create measurable success criteria for each feature
   - Build feedback loops into implementation

3. **DELIVERY PROTOCOL**

   - Maintain intellectual honesty about technical limitations
   - Push for specificity in implementation details
   - Create concrete test cases for each feature
   - Regularly validate against requirements

4. **EXECUTION FRAMEWORK**
   - Implement features in logical dependency order
   - Track progress against specification
   - Maintain code quality through refactoring
   - Address security and performance from the start

## IMPLEMENTATION SEQUENCE

Follow this sequence to build features in a logical order that minimizes rework and dependencies:

1. Core app architecture and navigation
2. Basic user management and onboarding
3. Plan calculation and nutritional logic
4. Dashboard and food tracking
5. AI photo recognition
6. Health app integration
7. Subscription and trial implementation
8. Visual styling and Ghibli elements
9. Backend optimization
10. Final integration and deployment

## FEATURE IMPLEMENTATION GUIDE

### 1. CORE APP ARCHITECTURE

**Objective:** Create the foundational structure for the application.

**Implementation Steps:**

1. **Project Setup**

   - Initialize cross-platform project (React Native)
   - Configure development environment
   - Set up version control
   - Establish folder structure for scalability

2. **Navigation Framework**

   - Implement bottom tab navigation (Home, Analytics, Settings)
   - Create navigation stack for onboarding flow
   - Implement modal navigation for overlays
   - Set up deep linking configuration

3. **State Management**

   - Implement centralized state management
   - Create user profile and authentication store
   - Set up food diary and nutritional tracking store
   - Configure persistence for offline capability

4. **Service Architecture**
   - Create API client for backend communication
   - Implement Google AI API service with tiered fallback
   - Set up health app connection services
   - Create subscription management service

**Critical Considerations:**

- Ensure architecture supports offline capability
- Design for cross-platform compatibility
- Implement proper error handling at architecture level
- Build with performance in mind from the start

### 2. ONBOARDING & USER MANAGEMENT

**Objective:** Create the welcome experience and user onboarding flow.

**Implementation Steps:**

1. **Welcome Screen**

   - Implement initial welcome screen with dashboard preview
   - Create "Get Started" and "Sign In" functionality
   - Implement preview toggle for Today/Yesterday
   - Configure navigation to onboarding or dashboard

2. **Authentication Flow**

   - Implement email/password authentication
   - Set up secure credential storage
   - Create account recovery mechanism
   - Implement session management

3. **Onboarding Sequence**

   - Create gender selection screen with options
   - Implement workout frequency selection with descriptions
   - Build attribution tracker with scrollable list
   - Create height/weight input with unit toggle
   - Implement goal and diet type selection
   - Create obstacles and aims selection screens
   - Implement progress indicator with state persistence

4. **Data Collection & Validation**
   - Implement form validation for all inputs
   - Create secure data transmission for personal information
   - Set up user profile storage
   - Implement onboarding state persistence for interrupted flows

**Critical Considerations:**

- Focus on minimizing friction in the onboarding process
- Ensure all user data is properly validated and securely stored
- Create a consistent visual style across all screens
- Implement proper progress tracking to encourage completion

### 3. PLAN CALCULATION & NUTRITIONAL LOGIC

**Objective:** Implement the core nutritional calculation engine.

**Implementation Steps:**

1. **BMR Calculation**

   - Implement Basal Metabolic Rate calculation formula
   - Create adjustment factors based on activity level
   - Implement goal-based modifier (lose/maintain/gain)
   - Set up personalization based on user metrics

2. **Macro Distribution**

   - Implement macro calculation based on total calories
   - Create adjustment based on diet type
   - Set up customization options for macro ratios
   - Implement validation to ensure nutritional balance

3. **Plan Generation**

   - Create plan calculation screen with progress indicator
   - Implement "setting everything up" animation
   - Build scientific sources section with references
   - Create completion announcement with results display

4. **Nutritional Database**
   - Set up food database with nutritional information
   - Implement search and filtering capabilities
   - Create portion size conversion utility
   - Set up caching for frequently accessed items

**Critical Considerations:**

- Ensure calculations are based on scientifically valid formulas
- Create proper validation to prevent impossible nutritional plans
- Implement adaptive calculations based on user goals
- Build calculation engine to be performant and accurate

### 4. DASHBOARD & FOOD TRACKING

**Objective:** Create the main user interface for tracking nutrition.

**Implementation Steps:**

1. **Main Dashboard**

   - Implement calorie counter with remaining calculation
   - Create macro tracking cards with visual indicators
   - Build recently eaten section with status display
   - Implement bottom navigation and action button
   - Create Today/Yesterday toggle with data persistence

2. **Food Entry Mechanisms**

   - Implement manual food entry form
   - Create recent foods quick-add functionality
   - Build custom food creation tool
   - Implement meal templates and favorites

3. **Food Diary**

   - Create daily food log with editable entries
   - Implement meal categorization (breakfast, lunch, dinner, snacks)
   - Build food entry details view
   - Create deletion and editing functionality

4. **Progress Visualization**
   - Implement circular progress indicators for calories and macros
   - Create historical data visualization
   - Build trend analysis for nutritional patterns
   - Implement goal progression tracking

**Critical Considerations:**

- Optimize dashboard for quick glanceable information
- Ensure real-time updates when values change
- Create intuitive food entry process to minimize friction
- Build with performance in mind for smooth scrolling and transitions

### 5. AI PHOTO RECOGNITION

**Objective:** Implement the AI-powered food recognition system.

**Implementation Steps:**

1. **Camera Integration**

   - Implement camera interface with food-focusing overlay
   - Create photo capture functionality
   - Build photo library access for existing images
   - Implement image optimization before processing

2. **Google AI Integration**

   - Set up Google AI API client with authentication
   - Implement tiered model approach (Gemini 2.5 Pro → 2.0 Flash → 2.0 Flash-Lite)
   - Create fallback mechanism for API limits and outages
   - Build request throttling and caching system

3. **Food Recognition Processing**

   - Implement image analysis pipeline
   - Create food identification algorithm
   - Build portion size estimation
   - Implement nutritional calculation based on recognition

4. **Results Interface**
   - Create processing status indicators
   - Build recognized food display with nutritional information
   - Implement correction interface for adjustments
   - Create confirmation and food diary integration

**Critical Considerations:**

- Optimize image processing for both accuracy and speed
- Implement robust error handling for recognition failures
- Create intelligent caching to reduce API calls
- Build user correction interface that's intuitive and quick to use

### 6. HEALTH APP INTEGRATION

**Objective:** Connect with device health platforms for activity data.

**Implementation Steps:**

1. **Health Integration Screen**

   - Create visual integration screen with activity icons
   - Implement permission explanation and request flow
   - Build connection visualization elements
   - Create skip option with later reminder

2. **iOS HealthKit Implementation**

   - Configure HealthKit permissions and entitlements
   - Implement read functionality for activity, weight, heart rate, and sleep
   - Create write capability for nutrition, water, and weight
   - Build background synchronization service

3. **Android Google Fit Implementation**

   - Configure Google Fit API permissions
   - Implement read functionality for activity and metrics
   - Create write capability for nutrition and weight
   - Build adaptive support for different Android versions

4. **Activity Calorie Adjustment**
   - Create activity calorie adjustment screen
   - Implement calorie calculation from activity data
   - Build adjustment mechanism for daily calorie goal
   - Create user preference storage for consistent behavior

**Critical Considerations:**

- Handle platform-specific differences gracefully
- Implement proper permission handling with clear explanations
- Create reliable synchronization that works across app restarts
- Build with battery efficiency in mind for background operations

### 7. SUBSCRIPTION & TRIAL IMPLEMENTATION

**Objective:** Implement the monetization system with free trial and subscription.

**Implementation Steps:**

1. **Free Trial Flow**

   - Create trial offer screen with specified elements
   - Implement payment method collection but no immediate charge
   - Build trial reminder screen with notification
   - Create trial period tracking system

2. **Subscription Options**

   - Implement subscription selection screen with monthly/yearly options
   - Create visual differentiation between options with pre-selection
   - Build special offer modal with triggered appearance
   - Implement restore purchases functionality

3. **Payment Processing**

   - Integrate with App Store In-App Purchase
   - Implement Google Play Billing
   - Create receipt validation service
   - Build subscription status verification

4. **Feature Gating**
   - Implement trial access to premium features
   - Create subscription status checking
   - Build appropriate messaging for non-subscribers
   - Implement upgrade prompts at strategic points

**Critical Considerations:**

- Ensure full compliance with App Store and Google Play policies
- Create seamless restoration process for returning users
- Implement secure payment processing with verification
- Build clear value proposition that encourages conversion

### 8. VISUAL STYLING & GHIBLI ELEMENTS

**Objective:** Implement distinctive Studio Ghibli-inspired visual elements.

**Implementation Steps:**

1. **Color Palette Implementation**

   - Replace Cal AI's colors with specified Ghibli-inspired palette
   - Implement warm cream (#F8F5F0) backgrounds
   - Use soft charcoal (#393939) for text
   - Apply custom macro nutrient colors
   - Create subtle watercolor gradients for progress bars

2. **Texture and Visual Elements**

   - Add subtle watercolor textures to backgrounds
   - Implement rounded corners (20px) throughout interface
   - Create hand-drawn quality for icons
   - Add gentle drop shadows with warm undertones
   - Implement delicate organic patterns in backgrounds

3. **Typography and Interactive Elements**

   - Configure fonts with slightly increased letter spacing
   - Implement subtle animations for interactive elements
   - Create gentle gradient effects for buttons
   - Add soft animation for selection indicators

4. **Animation and Transitions**
   - Implement gentle fade transitions between screens
   - Create soft pulse effects for button presses
   - Build watercolor-style loading indicators
   - Add particle effects resembling dust sprites for success states
   - Implement reduced motion support for accessibility

**Critical Considerations:**

- Maintain exact same layouts and positioning as Cal AI
- Ensure visual elements don't impact performance
- Create subtle distinction without changing functionality
- Build with accessibility in mind despite custom styling

### 9. BACKEND OPTIMIZATION

**Objective:** Optimize the backend infrastructure for Digital Ocean basic tier deployment.

**Implementation Steps:**

1. **Resource-Optimized Backend Structure**

   - Implement Node.js/Express backend with minimal footprint
   - Configure PostgreSQL database with connection pooling and indexing
   - Set up containerized deployment with resource limits
   - Implement Redis for caching with memory constraints
   - Create background worker for non-time-sensitive tasks

2. **AI Pipeline Optimization**

   - Implement client-side image preprocessing to reduce bandwidth
   - Create tiered model approach with appropriate fallbacks
   - Design aggressive caching for common food items
   - Configure request throttling to stay within free API limits
   - Implement batch processing for non-critical operations

3. **PostgreSQL Database Optimization**

   - Design efficient schema with proper relationships
   - Implement appropriate indexes for common queries
   - Configure connection pooling for optimal resource usage
   - Set up periodic vacuum and maintenance tasks
   - Implement query optimization for complex operations

4. **Caching Strategy**

   - Implement Redis for session management and frequent queries
   - Design user-specific food recognition memory
   - Create time-based cache invalidation strategy
   - Set up compressed data storage for cache entries
   - Implement fallback to local database during API unavailability

5. **Monitoring & Security**
   - Set up resource monitoring with alert thresholds
   - Implement secure authentication and request validation
   - Create backup and restore procedures
   - Design privacy-focused data management
   - Implement compliance with data protection regulations

**Critical Considerations:**

- Optimize for Digital Ocean basic tier resource constraints
- Ensure system can scale horizontally when needed
- Implement proper error handling and fallbacks
- Design with security and privacy as core principles
- Create observability tooling for rapid issue identification

### 10. FINAL INTEGRATION & DEPLOYMENT

**Objective:** Connect all components and prepare for production release.

**Implementation Steps:**

1. **Component Integration**

   - Connect all UI flows seamlessly
   - Implement consistent state management
   - Create unified navigation experience
   - Build comprehensive error handling

2. **User Experience Optimization**

   - Implement smooth transitions between screens
   - Optimize startup time and response speed
   - Create skeleton screens for loading states
   - Build optimized animations for 60fps performance

3. **Comprehensive Testing**

   - Implement test suite for critical paths
   - Create platform-specific testing
   - Build performance testing suite
   - Implement security validation tests

4. **App Store Preparation**
   - Create compelling store listings
   - Implement in-app review prompts
   - Ensure compliance with latest store guidelines
   - Build phased rollout strategy

**Critical Considerations:**

- Focus on seamless connections between features
  - Ensure consistent user experience throughout the app
  - Create proper error recovery for all possible failure points
  - Build with future maintenance and updates in mind

## SECURITY REQUIREMENTS

When implementing all features, adhere to these security requirements:

1. **Authentication & Authorization**

   - Implement secure authentication flow
   - Create proper authorization checks
   - Follow principle of least privilege
   - Use secure storage for credentials

2. **Data Protection**

   - Encrypt sensitive data at rest and in transit
   - Implement proper input validation
   - Prevent XSS vulnerabilities with output encoding
   - Create SQL injection protection

3. **API Security**

   - Implement rate limiting for API endpoints
   - Create proper error handling without leaking information
   - Build input validation for all API endpoints
   - Use secure communication protocols

4. **Dependency Management**
   - Use updated dependencies without vulnerabilities
   - Minimize unnecessary dependencies
   - Implement proper error handling
   - Create timeout configurations for external services

## TESTING APPROACH

For each feature, implement the following testing approach:

1. **Unit Testing**

   - Test individual functions and components
   - Verify calculations and transformations
   - Create tests for edge cases and error conditions
   - Implement comprehensive test coverage

2. **Integration Testing**

   - Test component interactions
   - Verify data flow between systems
   - Create tests for API integrations
   - Build end-to-end workflow tests

3. **Performance Testing**

   - Test app startup time
   - Verify UI responsiveness
   - Create load testing for backend
   - Implement memory usage monitoring

4. **Security Testing**
   - Verify authentication mechanisms
   - Test input validation and sanitization
   - Create penetration testing scenarios
   - Implement data protection validation

## CONCLUSION

Follow this implementation guide to build the Nutri AI app systematically. Each feature should be built with attention to the hyper-rational engineering principles, with particular focus on efficiency, scalability, and user experience.

Remember that the app should maintain Cal AI's proven functional layout while implementing subtle Studio Ghibli-inspired visual elements for differentiation. The primary goal is to create a highly usable nutrition tracking app that drives subscription conversion through its AI-powered food recognition capabilities.

By following this structured approach, you will create a market-viable application that can succeed as a premium nutrition tracking solution while meeting all platform requirements for approval.
