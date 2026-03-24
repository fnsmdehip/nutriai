/**
 * NutriAI Design System
 * Dark mode theme - premium health/wellness app styling.
 *
 * Typography hierarchy:
 *   - SF Pro Display: Hero numbers (48-72pt thin weight)
 *   - SF Pro Text: Body copy (17pt regular)
 *   - SF Pro Rounded: Friendly UI elements
 *
 * Color rationale:
 *   - #0B1A2E navy: Premium dark background
 *   - #2ED573 green: Positive/healthy actions
 *   - #FF6B6B coral: Warnings/negative values
 *   - True black #000000 available for OLED mode
 */

export const Theme = {
  colors: {
    // Core palette
    primary: '#2ED573',
    secondary: '#7895B2',
    background: '#0B1A2E',
    backgroundOLED: '#000000',
    surface: '#1A2B45',
    card: '#1A2B45',
    text: '#FFFFFF',
    textSecondary: '#8898AA',
    border: '#253A54',

    // Status
    error: '#FF6B6B',
    warning: '#FFD93D',
    success: '#2ED573',

    // Nutrition macro colors
    protein: '#FF6B6B',
    carbs: '#2ED573',
    fat: '#5B8DEF',

    // Subscription / premium
    premium: '#FFD700',
    inactive: '#4A5568',
    disabled: '#2D3748',

    // Surfaces and accents
    cardBackground: '#142237',
    accent: '#FF6B6B',
    highlight: '#1E3A5F',
    shadow: '#000000',
    primaryLight: '#1A3D2A',
    watercolor: '#152A42',
  },

  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      body: 17,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
      hero: 48,
      heroLarge: 72,
    },
    letterSpacing: {
      tight: -0.2,
      normal: 0.3,
      wide: 1.2,
    },
    lineHeight: {
      tight: 1.3,
      normal: 1.5,
      loose: 1.8,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  border: {
    width: {
      thin: 1,
      normal: 2,
      thick: 3,
    },
    radius: {
      small: 8,
      medium: 12,
      large: 20,
      round: 999,
    },
  },

  shadow: {
    small: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 8,
    },
    none: {
      shadowOpacity: 0,
      elevation: 0,
    },
  },

  animation: {
    timing: {
      quick: 200,
      normal: 300,
      slow: 500,
    },
    maxDuration: 400,
  },

  touchTarget: {
    minimum: 44,
  },

  opacity: {
    disabled: 0.4,
    pressed: 0.85,
    active: 0.7,
    overlay: 0.6,
  },
};
