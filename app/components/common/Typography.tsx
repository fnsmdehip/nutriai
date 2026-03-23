import React from 'react';
import { Text, StyleSheet, TextStyle, TextProps } from 'react-native';
import { Theme } from '../../utils/theme';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';
  weight?: 'regular' | 'medium' | 'bold';
  color?: keyof typeof Theme.colors | string;
  style?: TextStyle;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  weight = 'regular',
  color = 'text',
  style,
  align = 'auto',
  children,
  ...props
}) => {
  // Determine the font weight
  const getFontWeight = () => {
    switch (weight) {
      case 'bold':
        return '700';
      case 'medium':
        return '500';
      default:
        return '400';
    }
  };

  // Get text color
  const getColor = () => {
    if (typeof color === 'string' && color in Theme.colors) {
      return Theme.colors[color as keyof typeof Theme.colors];
    }
    return color;
  };
  
  // Get variant-specific styles
  const getVariantStyle = () => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: Theme.typography.fontSize.xxxl,
          lineHeight: Theme.typography.fontSize.xxxl * 1.2,
          letterSpacing: Theme.typography.letterSpacing.wide,
          marginBottom: Theme.spacing.md,
        };
      case 'h2':
        return {
          fontSize: Theme.typography.fontSize.xxl,
          lineHeight: Theme.typography.fontSize.xxl * 1.2,
          letterSpacing: Theme.typography.letterSpacing.normal,
          marginBottom: Theme.spacing.sm,
        };
      case 'h3':
        return {
          fontSize: Theme.typography.fontSize.xl,
          lineHeight: Theme.typography.fontSize.xl * 1.2,
          letterSpacing: Theme.typography.letterSpacing.normal,
          marginBottom: Theme.spacing.sm,
        };
      case 'h4':
        return {
          fontSize: Theme.typography.fontSize.lg,
          lineHeight: Theme.typography.fontSize.lg * 1.2,
          letterSpacing: Theme.typography.letterSpacing.normal,
          marginBottom: Theme.spacing.sm,
        };
      case 'caption':
        return {
          fontSize: Theme.typography.fontSize.xs,
          lineHeight: Theme.typography.fontSize.xs * 1.3,
          letterSpacing: Theme.typography.letterSpacing.tight,
        };
      case 'label':
        return {
          fontSize: Theme.typography.fontSize.sm,
          lineHeight: Theme.typography.fontSize.sm * 1.3,
          letterSpacing: Theme.typography.letterSpacing.normal,
          fontWeight: '500' as const,
        };
      default: // body
        return {
          fontSize: Theme.typography.fontSize.sm,
          lineHeight: Theme.typography.fontSize.sm * 1.5,
          letterSpacing: Theme.typography.letterSpacing.tight,
        };
    }
  };

  return (
    <Text
      style={[
        {
          fontFamily: Theme.typography.fontFamily.regular,
          color: getColor(),
          fontWeight: getFontWeight(),
          textAlign: align,
        },
        getVariantStyle(),
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Pre-configured variant components for easier use
export const H1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const H2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const H3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const H4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h4" {...props} />
);

export const Body: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);

export const Label: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="label" {...props} />
);

export default Typography; 