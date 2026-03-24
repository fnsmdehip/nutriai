/**
 * NutriAI Design System
 * Dark mode theme based on PRINTMAXX V2 top-grossing health/wellness apps.
 */

export const Theme = {
  colors: {
    // Core palette
    primary: '#2ED573',       // Green accent (good / positive)
    secondary: '#7895B2',     // Muted blue
    background: '#0B1A2E',    // Deep navy background
    surface: '#1A2B45',       // Card / elevated surface
    card: '#1A2B45',          // Alias for surface
    text: '#FFFFFF',          // Primary text
    textSecondary: '#8898AA', // Secondary / muted text
    border: '#253A54',        // Subtle divider

    // Status
    error: '#FF6B6B',         // Coral for bad / errors
    warning: '#FFD93D',       // Warm gold
    success: '#2ED573',       // Same as primary green

    // Nutrition macro colors
    protein: '#FF6B6B',       // Coral
    carbs: '#2ED573',         // Green
    fat: '#5B8DEF',           // Blue

    // Subscription / premium
    premium: '#FFD700',       // Gold
    inactive: '#4A5568',      // Dark gray
    disabled: '#2D3748',      // Darker gray

    // Surfaces and accents
    cardBackground: '#142237', // Slightly different surface for nesting
    accent: '#FF6B6B',        // Coral accent
    highlight: '#1E3A5F',     // Highlighted card surface
    shadow: '#000000',        // Shadow color
    primaryLight: '#1A3D2A',  // Muted green tint for backgrounds
    watercolor: '#152A42',    // Subtle blue tint surface
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
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
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
  },

  opacity: {
    disabled: 0.4,
    hover: 0.85,
    active: 0.7,
    overlay: 0.6,
  },
};
