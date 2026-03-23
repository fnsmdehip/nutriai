# NUTRI AI IMPLEMENTATION GUIDE

## CRITICAL AGENT REQUIREMENTS

**MANDATORY**: All AI agents working on this project MUST scan docs/hyper rat soft engin.rtf BEFORE analyzing any prompt or generating any response. This document contains the core operating methodology that MUST be followed for all implementation work.

**IMPLEMENTATION PARADIGM**:

- Apply hyper-rational, first-principles thinking to ALL technical decisions
- Deconstruct problems to foundational elements before proposing solutions
- Maintain zero tolerance for technical shortcuts or unexplained design choices
- Structure all responses according to the Situation Analysis → Solution Architecture → Execution Framework format
- Push for specificity and concrete action at all times
- Challenge conventional implementation patterns that sacrifice performance

Deviation from this methodology will result in sub-optimal technical solutions and is NOT PERMITTED.

## INTRODUCTION

This document serves as an implementation guide for building the Nutri AI application, a premium AI-powered nutrition tracking and wellness app with Cal AI-inspired functionality and Studio Ghibli-inspired visual elements. This guide breaks down the implementation process into phases, provides testing strategies for each feature, and offers manual verification steps.

## PROJECT FOUNDATION

### Technology Stack

- **Frontend**: React Native for cross-platform development
- **Backend**: Node.js with Express for API endpoints
- **Database**: PostgreSQL for efficient data storage and querying
- **AI Integration**: Google AI API (Gemini models with tiered approach)
- **Authentication**: Custom JWT-based Authentication (Node.js/PostgreSQL)
- **Deployment**: Digital Ocean basic tier droplet

### Environment Setup

1. **Development Environment**:

   - Node.js (v16+)
   - React Native CLI
   - VSCode/Cursor IDE with appropriate extensions
   - iOS/Android emulators or physical devices for testing

2. **API Requirements**:
   - Google AI API access (Gemini 2.5 Pro Experimental, Gemini 2.0 Flash, Gemini 2.0 Flash-Lite)
   - Apple Developer account (for HealthKit integration)
   - Google Developer account (for Google Fit integration)
   - PostgreSQL database setup optimized for Digital Ocean

## IMPLEMENTATION PHASES

### Phase 1: Core App Architecture

#### Tasks:

1. Project initialization and folder structure setup
2. Basic navigation framework
3. State management implementation
4. Theme and styling foundation with Studio Ghibli-inspired elements
5. API service architecture

#### Testing:

- Navigation flow between screens
- State persistence across app restarts
- Theme consistency across components
- API request/response handling

#### Manual Verification:

- Verify app launches without errors
- Check navigation between screens functions correctly
- Confirm theme applies consistently
- Test API service with mock data

### Phase 2: Onboarding Flow

#### Tasks:

1. Welcome screen implementation matching Cal AI layout
2. User signup/authentication
3. Onboarding sequence screens (gender, workout frequency, etc.)
4. Progress tracking during onboarding
5. Personal metrics collection

#### Testing:

- Form validation on all input fields
- Progress persistence if onboarding is interrupted
- Authentication flow security
- Data storage of user preferences

#### Manual Verification:

- Complete the full onboarding flow as a new user
- Test back navigation functionality
- Verify progress indicator updates correctly
- Check all input validation works properly
- Confirm all user data is saved correctly

### Phase 3: Plan Calculation & Health Integration

#### Tasks:

1. BMR calculation implementation
2. Calorie and macro goal generation
3. Apple Health / Google Fit integration
4. Activity data synchronization
5. Plan completion visualization with scientific references

#### Testing:

- BMR calculation accuracy with different inputs
- Health app permission handling
- Data synchronization reliability
- Edge cases for various weight/height/activity combinations

#### Manual Verification:

- Verify BMR calculations against established formulas
- Test health app connection on both iOS and Android
- Check activity data appears correctly in app
- Confirm plan displays appropriate calorie/macro targets

### Phase 4: Subscription & Trial Implementation

#### Tasks:

1. Mandatory free trial flow implementation
2. Subscription options screens
3. Payment processing integration
4. Restoration functionality
5. Special offer modal logic

#### Testing:

- Trial period tracking
- Subscription state management
- Purchase validation
- Restore functionality

#### Manual Verification:

- Complete trial registration flow
- Test subscription purchase (using sandbox accounts)
- Verify subscription benefits activate properly
- Test restore purchases functionality
- Confirm special offer appears at appropriate times

### Phase 5: Dashboard & Food Tracking

#### Tasks:

1. Main dashboard implementation matching Cal AI layout
2. Daily calorie and macro tracking
3. Manual food entry interface
4. Recent meals display
5. Progress visualization

#### Testing:

- Calorie calculations accuracy
- Macro balance calculations
- Data persistence for food entries
- UI updates based on consumption

#### Manual Verification:

- Add food entries manually
- Verify calorie counts update correctly
- Check macro balance visualization reflects entries
- Test daily reset functionality
- Confirm yesterday/today toggle works properly

### Phase 6: AI Photo Recognition

#### Tasks:

1. Camera interface implementation with Ghibli-inspired styling
2. Photo capture and optimization
3. Google AI API integration with tiered model approach
4. Food recognition processing
5. Results display with nutritional breakdown

#### Testing:

- Camera permission handling
- Image optimization efficiency
- API response parsing
- Result accuracy verification
- Error handling for recognition failures

#### Manual Verification:

- Take photos of various food items
- Verify recognition accuracy for common foods
- Test portion size estimation
- Check nutritional data appears correctly
- Verify manual corrections can be made

### Phase 7: Visual Styling & Ghibli Elements

#### Tasks:

1. Implement Studio Ghibli-inspired color palette
2. Create custom iconography with hand-drawn quality
3. Add texture and visual element integration
4. Design animation and transition styling
5. Refine typography with increased spacing

#### Testing:

- Performance impact of visual elements
- Animation frame rates
- Accessibility of Studio Ghibli-inspired elements
- Cross-platform visual consistency

#### Manual Verification:

- Verify visual elements look correct on different devices
- Check animations run smoothly
- Confirm accessibility features work with custom styling
- Test reduced motion settings compatibility

### Phase 8: Backend Optimization

#### Tasks:

1. Server-side API endpoint implementation optimized for Digital Ocean
2. PostgreSQL database optimization for basic tier resources:
   - Connection pooling configuration
   - Query optimization and proper indexing
   - Memory usage tuning
3. Containerized deployment with resource limits:
   - Nginx container for reverse proxy
   - API server container
   - Database container
   - Redis for caching
4. Batch processing for non-time-sensitive operations
5. Monitoring and analytics setup

#### Testing:

- API response times
- Resource utilization under load
- Cache hit rates
- Error rates and handling
- Database query performance

#### Manual Verification:

- Monitor server resource usage during typical operations
- Verify API responses are properly cached
- Check error handling for various failure scenarios
- Test system under simulated load
- Monitor database connection usage

### Phase 9: Final Integration & Deployment

#### Tasks:

1. Component integration
2. Performance optimization
3. Comprehensive testing
4. Store listing preparation
5. Release strategy implementation

#### Testing:

- End-to-end user flows
- Performance benchmarks
- Cross-device compatibility
- Store compliance checks

#### Manual Verification:

- Complete full user journeys from onboarding to daily use
- Check app performance on various devices
- Verify all app store requirements are met
- Test in-app review prompts functionality

## FEATURE TESTING MATRIX

| Feature            | Unit Tests                             | Integration Tests               | Manual Tests           |
| ------------------ | -------------------------------------- | ------------------------------- | ---------------------- |
| Onboarding         | Form validation, Data storage          | Flow completion, Authentication | Complete user flow     |
| Health Integration | Permission handling, Data parsing      | Health app synchronization      | Verify data appears    |
| Subscription       | State management, Trial period         | Purchase validation             | Test purchase flow     |
| Dashboard          | Calorie calculation, Data persistence  | UI updates                      | Add/edit food entries  |
| Photo Recognition  | Image optimization, API integration    | Recognition accuracy            | Test with varied foods |
| Visual Styling     | Theme consistency, Accessibility       | Cross-platform appearance       | Visual inspection      |
| Backend            | Endpoint functionality, Error handling | System performance              | Load testing           |

## SECURITY CHECKLIST

- [ ] Implement secure authentication flow
- [ ] Enable data encryption at rest
- [ ] Secure API endpoints with proper authentication
- [ ] Implement input validation for all user inputs
- [ ] Set up secure storage for sensitive user data
- [ ] Configure proper permission handling for health data
- [ ] Implement secure communication for payment processing
- [ ] Set up monitoring for suspicious activity
- [ ] Create data backup and recovery procedures
- [ ] Implement privacy controls for user data

## COMPLIANCE REQUIREMENTS

- [ ] GDPR compliance for user data handling
- [ ] CCPA compliance for California users
- [ ] App Store Review Guidelines adherence
- [ ] Google Play Store Policy Requirements
- [ ] Health data regulations compliance
- [ ] Subscription billing transparency
- [ ] Clear terms of service and privacy policy
- [ ] Proper medical disclaimers implementation
- [ ] Accessibility standards compliance
- [ ] Age-appropriate design considerations

## RESOURCES

- Cal AI reference screenshots (in `cal ai/` directory)
- Nutri AI PRD document (`docs/nutri-ai-prd-real.md`)
- Hyper rat soft engineering guidelines (`hyper rat soft engin.rtf`)

## CONCLUSION

Follow this implementation guide to build the Nutri AI app systematically, testing each feature thoroughly before proceeding to the next phase. The guide prioritizes functionality that matches Cal AI's proven approach first, followed by Studio Ghibli-inspired visual styling to ensure a solid foundation.

Remember to use the Cal AI screenshots as reference for the UI/UX flow while implementing the distinctive visual styling specified in the PRD to ensure App Store approval by maintaining functional similarity but visual distinctiveness.

## MANDATORY: COMMUNICATION PROTOCOL

**IMPORTANT: READ THIS SECTION FIRST**

When implementing any feature or fixing any issue, all your responses MUST follow the hyper-rational communication protocol defined in `hyper-rat-soft-engin.rtf`. This is non-negotiable and applies to ALL communications.

Your responses must be structured with these exact sections:

1. **SITUATION ANALYSIS**

   - Core problem statement
   - Key assumptions identified
   - First principles breakdown
   - Critical variables isolated

2. **SOLUTION ARCHITECTURE**

   - Strategic intervention points
   - Specific action steps
   - Success metrics
   - Risk mitigation

3. **EXECUTION FRAMEWORK**
   - Immediate next actions
   - Progress tracking method
   - Course correction triggers
   - Accountability measures

This protocol ensures clarity, directness, and solutions-focused communication. No excuses, no fluff, just problem-solving.
