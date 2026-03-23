import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../../utils/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  // Get button container style based on variant
  const getContainerStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryContainer;
      case 'secondary':
        return styles.secondaryContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'text':
        return styles.textContainer;
      default:
        return styles.primaryContainer;
    }
  };

  // Get text style based on variant
  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'text':
        return styles.textText;
      default:
        return styles.primaryText;
    }
  };

  // Get button size style
  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  // Get text size style
  const getTextSizeStyle = (): TextStyle => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getContainerStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabledContainer,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'text' ? Theme.colors.primary : 'white'}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            getTextStyle(),
            getTextSizeStyle(),
            disabled && styles.disabledText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: Theme.border.radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadow.small,
  },
  fullWidth: {
    width: '100%',
  },
  // Variant styles - containers
  primaryContainer: {
    backgroundColor: Theme.colors.primary,
    borderWidth: 0,
  },
  secondaryContainer: {
    backgroundColor: Theme.colors.secondary,
    borderWidth: 0,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  textContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    ...Theme.shadow.none,
  },
  // Variant styles - text
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: 'white',
  },
  outlineText: {
    color: Theme.colors.primary,
  },
  textText: {
    color: Theme.colors.primary,
  },
  // Size styles - containers
  smallButton: {
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
    minHeight: 32,
  },
  mediumButton: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
    minHeight: 44,
  },
  largeButton: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xl,
    minHeight: 56,
  },
  // Size styles - text
  smallText: {
    fontSize: Theme.typography.fontSize.sm,
  },
  mediumText: {
    fontSize: Theme.typography.fontSize.md,
  },
  largeText: {
    fontSize: Theme.typography.fontSize.lg,
  },
  // Disabled styles
  disabledContainer: {
    opacity: Theme.opacity.disabled,
  },
  disabledText: {
    color: Theme.colors.textSecondary,
  },
});

export default Button; 