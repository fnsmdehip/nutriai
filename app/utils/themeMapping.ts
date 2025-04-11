/**
 * This file provides a mapping layer to handle theme naming convention inconsistencies.
 * Use these functions to fix TypeScript errors related to the Theme object properties.
 */

import { Theme } from './theme';

/**
 * Maps the older spacing aliases to the current theme spacing values
 */
export const spacing = {
  ...Theme.spacing,
  // Legacy naming conventions mapped to current values
  s: Theme.spacing.sm,
  m: Theme.spacing.md,
  l: Theme.spacing.lg,
};

/**
 * Maps the older font size aliases to the current theme fontSize values
 */
export const fontSize = {
  ...Theme.typography.fontSize,
  // Legacy naming conventions mapped to current values
  small: Theme.typography.fontSize.sm,
  medium: Theme.typography.fontSize.md,
  large: Theme.typography.fontSize.lg,
  xlarge: Theme.typography.fontSize.xl,
  xxlarge: Theme.typography.fontSize.xxl,
};

/**
 * A theme proxy that allows using both the old and new naming conventions
 */
export const ThemeCompat = {
  ...Theme,
  spacing,
  typography: {
    ...Theme.typography,
    fontSize,
  },
};

// Export a type for the compatible theme
export type ThemeCompatType = typeof ThemeCompat; 