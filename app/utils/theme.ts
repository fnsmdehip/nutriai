// Theme configuration with Studio Ghibli-inspired colors

export const Theme = {
  colors: {
    // Studio Ghibli inspired color palette
    primary: '#5D9C59', // Warm earthy green (Totoro moss color)
    secondary: '#7895B2', // Muted blue (Howl's castle sky)
    background: '#F8F5F0', // Warm cream (Parchment texture)
    card: '#FFFBF0', // Soft white with slight warmth
    text: '#393939', // Deep charcoal (Spirited Away)
    textSecondary: '#6E6E6E', // Muted dusty mauve
    border: '#E5E0D5', // Light sandy beige
    error: '#D67B56', // Earthy terracotta (Spirited Away)
    warning: '#F7D060', // Warm golden yellow (Castle in the Sky)
    success: '#7C9A6F', // Forest green

    // Nutrition colors with Ghibli warmth
    protein: '#D67B56', // Earthy terracotta
    carbs: '#7C9A6F', // Forest green
    fat: '#8AADC1', // Muted blue

    // Status colors
    premium: '#F9E897', // Soft gold for premium features (Laputa golden city)
    inactive: '#ACA8A6', // Ghibli-inspired slate gray
    disabled: '#D8D9CF', // Soft grayish beige
    cardBackground: '#F0EBE2', // Light parchment for card backgrounds

    // Additional Ghibli-inspired colors
    accent: '#D98C5F', // Warm amber (Spirited Away)
    highlight: '#F5E8C7', // Soft warm highlight color
    shadow: '#534340', // Rich soil brown for shadows
    primaryLight: '#D5EBC8', // Light moss green for backgrounds and accents
    watercolor: '#D6E8F7', // Soft sky blue for water-inspired elements
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
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    letterSpacing: {
      tight: -0.2,
      normal: 0.4, // Increased for Ghibli-inspired spacing
      wide: 1.8, // Increased for more airy feel
    },
    lineHeight: {
      tight: 1.3,
      normal: 1.6,
      loose: 2.1, // Slightly increased for more space
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
      small: 8, // Increased for softer edges
      medium: 14, // Increased for softer edges
      large: 20, // Match PRD specification (20px)
      round: 999,
    },
  },

  // Shadows with Ghibli-style softness
  shadow: {
    small: {
      shadowColor: '#534340', // Warmer undertones
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06, // Softer shadow
      shadowRadius: 3, // More diffuse
      elevation: 1,
    },
    medium: {
      shadowColor: '#534340', // Warmer undertones
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.09, // Softer shadow
      shadowRadius: 4.5, // More diffuse
      elevation: 3,
    },
    large: {
      shadowColor: '#534340', // Warmer undertones
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12, // Softer shadow
      shadowRadius: 6.5, // More diffuse
      elevation: 5,
    },
    none: {
      shadowOpacity: 0,
      elevation: 0,
    },
  },

  // Animation timing - slightly slower for Ghibli's softer feeling
  animation: {
    timing: {
      quick: 220, // Slightly slower for gentle feel
      normal: 350,
      slow: 500,
    },
    easing: {
      gentle: 'cubic-bezier(0.4, 0.0, 0.2, 1)', // Soft, natural easing
      bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Slight bounce like Studio Ghibli character movements
      emphasis: 'cubic-bezier(0.1, 0.9, 0.2, 1)', // Emphasized movement
    },
  },

  // Helper functions
  opacity: {
    disabled: 0.4,
    hover: 0.85,
    active: 0.7,
    overlay: 0.08, // For subtle background textures
    watercolor: 0.06, // For very subtle watercolor effects
  },
}; 