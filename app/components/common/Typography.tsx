import React from 'react';
import { Text, StyleSheet } from 'react-native';
import type { TextStyle, TextProps } from 'react-native';
import { Theme } from '../../utils/theme';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';
  weight?: 'regular' | 'medium' | 'bold';
  color?: string;
  style?: TextStyle;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  weight = 'regular',
  color,
  style,
  align = 'auto',
  children,
  ...props
}) => {
  const getFontWeight = (): TextStyle['fontWeight'] => {
    switch (weight) {
      case 'bold':
        return '700';
      case 'medium':
        return '500';
      default:
        return '400';
    }
  };

  const resolvedColor = color ?? Theme.colors.text;

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: Theme.typography.fontSize.xxxl,
          lineHeight: Theme.typography.fontSize.xxxl * 1.2,
        };
      case 'h2':
        return {
          fontSize: Theme.typography.fontSize.xxl,
          lineHeight: Theme.typography.fontSize.xxl * 1.2,
        };
      case 'h3':
        return {
          fontSize: Theme.typography.fontSize.xl,
          lineHeight: Theme.typography.fontSize.xl * 1.2,
        };
      case 'h4':
        return {
          fontSize: Theme.typography.fontSize.lg,
          lineHeight: Theme.typography.fontSize.lg * 1.2,
        };
      case 'caption':
        return {
          fontSize: Theme.typography.fontSize.xs,
          lineHeight: Theme.typography.fontSize.xs * 1.3,
        };
      case 'label':
        return {
          fontSize: Theme.typography.fontSize.sm,
          lineHeight: Theme.typography.fontSize.sm * 1.3,
          fontWeight: '500',
        };
      default:
        return {
          fontSize: Theme.typography.fontSize.sm,
          lineHeight: Theme.typography.fontSize.sm * 1.5,
        };
    }
  };

  return (
    <Text
      style={[
        {
          color: resolvedColor,
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

export const H1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" weight="bold" {...props} />
);

export const H2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" weight="bold" {...props} />
);

export const H3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" weight="bold" {...props} />
);

export const H4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h4" weight="bold" {...props} />
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
