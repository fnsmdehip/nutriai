import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { Theme } from '../../utils/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  containerStyle,
  textStyle,
  ...props
}) => {
  // Determine button styles based on variant
  const buttonStyles = [
    styles.container,
    styles[`${variant}Container`],
    styles[`${size}Container`],
    disabled && styles.disabledContainer,
    containerStyle,
  ];

  // Determine text styles based on variant
  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'primary'
              ? Theme.colors.background
              : Theme.colors.primary
          }
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Theme.border.radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Variant styles - Container
  primaryContainer: {
    backgroundColor: Theme.colors.primary,
  },
  secondaryContainer: {
    backgroundColor: Theme.colors.card,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  textContainer: {
    backgroundColor: 'transparent',
  },
  // Size styles - Container
  smallContainer: {
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.m,
  },
  mediumContainer: {
    paddingVertical: Theme.spacing.m,
    paddingHorizontal: Theme.spacing.l,
  },
  largeContainer: {
    paddingVertical: Theme.spacing.l,
    paddingHorizontal: Theme.spacing.xl,
  },
  // Disabled state
  disabledContainer: {
    backgroundColor: Theme.colors.disabled,
    borderColor: Theme.colors.disabled,
  },
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  // Variant styles - Text
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: Theme.colors.text,
  },
  outlineText: {
    color: Theme.colors.primary,
  },
  textText: {
    color: Theme.colors.primary,
  },
  // Size styles - Text
  smallText: {
    fontSize: Theme.typography.fontSize.small,
  },
  mediumText: {
    fontSize: Theme.typography.fontSize.medium,
  },
  largeText: {
    fontSize: Theme.typography.fontSize.large,
  },
  // Disabled state
  disabledText: {
    color: Theme.colors.textSecondary,
  },
});

export default Button; 