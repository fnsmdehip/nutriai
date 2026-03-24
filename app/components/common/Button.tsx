import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
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
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'text':
        return styles.textVariantContainer;
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'text':
        return styles.textVariantText;
      default:
        return styles.primaryText;
    }
  };

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
        fullWidth ? styles.fullWidth : {},
        disabled ? styles.disabledContainer : {},
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'text' ? Theme.colors.primary : '#FFFFFF'}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.buttonText,
            getTextStyle(),
            getTextSizeStyle(),
            disabled ? styles.disabledText : {},
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
  primaryContainer: {
    backgroundColor: Theme.colors.primary,
  },
  secondaryContainer: {
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    ...Theme.shadow.none,
  },
  textVariantContainer: {
    backgroundColor: 'transparent',
    ...Theme.shadow.none,
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: Theme.colors.text,
  },
  outlineText: {
    color: Theme.colors.primary,
  },
  textVariantText: {
    color: Theme.colors.primary,
  },
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
  smallText: {
    fontSize: Theme.typography.fontSize.sm,
  },
  mediumText: {
    fontSize: Theme.typography.fontSize.md,
  },
  largeText: {
    fontSize: Theme.typography.fontSize.lg,
  },
  disabledContainer: {
    opacity: Theme.opacity.disabled,
  },
  disabledText: {
    color: Theme.colors.textSecondary,
  },
});

export default Button;
