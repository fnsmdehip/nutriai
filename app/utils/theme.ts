// Theme configuration with Studio Ghibli-inspired colors
export const Theme = {
  colors: {
    primary: '#4CAF50',     // Green for main brand color
    secondary: '#2196F3',   // Blue for secondary actions
    background: '#F5F7FA',  // Light gray for app background
    card: '#FFFFFF',        // White for cards
    text: '#333333',        // Dark gray for primary text
    textSecondary: '#757575', // Medium gray for secondary text
    border: '#E0E0E0',      // Light gray for borders
    error: '#F44336',       // Red for errors
    warning: '#FFC107',     // Yellow for warnings
    success: '#4CAF50',     // Green for success indicators
    
    // Nutrition colors
    protein: '#FF5722',     // Orange-red for protein
    carbs: '#2196F3',       // Blue for carbs
    fat: '#FFC107',         // Yellow for fat
    
    // Status colors
    premium: '#FFD700',     // Gold for premium features
    inactive: '#BDBDBD',    // Gray for inactive states
    
    // UI elements
    disabled: '#CCCCCC', // Gray for disabled states
  },
  
  // Typography
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
      xl: 22,
      xxl: 28,
      xxxl: 36,
    },
    letterSpacing: {
      tight: -0.5,
      normal: 0.2, // Slightly increased from 0
      wide: 1.2,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      loose: 1.8,
    },
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Borders
  border: {
    width: {
      thin: 1,
      normal: 2,
      thick: 3,
    },
    radius: {
      small: 4,
      medium: 8,
      large: 16,
      round: 999,
    },
  },
  
  // Shadows
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
  
  // Animation timing
  animation: {
    timing: {
      quick: 150,
      normal: 300,
      slow: 450,
    },
  },
  
  // Helper functions
  opacity: {
    disabled: 0.5,
    hover: 0.8,
    active: 0.6,
  },
};

// Types for theme
export type ThemeType = typeof Theme;

// Helper types for theme-aware components
export type ThemeColor = keyof typeof Theme.colors;
export type ThemeSpacing = keyof typeof Theme.spacing;
export type ThemeFontSize = keyof typeof Theme.typography.fontSize;
export type ThemeBorderRadius = keyof typeof Theme.border.radius; 