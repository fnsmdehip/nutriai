import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps 
} from 'react-native';
import { Theme, ThemeColor } from '../utils/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ThemeColor;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  color = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...rest
}) => {
  const buttonStyle = getButtonStyle(variant, size, color, disabled, fullWidth);
  const textStyleForButton = getTextStyle(variant, size, color, disabled);

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? Theme.colors.card : Theme.colors[color]}
        />
      ) : (
        <>
          {leftIcon}
          <Text style={[textStyleForButton, textStyle]}>{title}</Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const getButtonStyle = (
  variant: ButtonVariant, 
  size: ButtonSize, 
  colorName: ThemeColor,
  disabled: boolean,
  fullWidth: boolean
): ViewStyle => {
  // Base styles
  const baseStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.border.radius.medium,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    opacity: disabled ? Theme.opacity.disabled : 1,
    ...getSizeStyle(size),
  };

  const color = Theme.colors[colorName];

  // Variant-specific styles
  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        backgroundColor: color,
        ...Theme.shadows.medium,
      };
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: Theme.colors.background,
        borderWidth: Theme.border.width.thin,
        borderColor: color,
      };
    case 'outline':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: Theme.border.width.thin,
        borderColor: color,
      };
    case 'text':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
      };
    default:
      return baseStyle;
  }
};

const getTextStyle = (
  variant: ButtonVariant, 
  size: ButtonSize, 
  colorName: ThemeColor,
  disabled: boolean,
): TextStyle => {
  // Base text styles
  const baseStyle: TextStyle = {
    textAlign: 'center',
    fontFamily: Theme.typography.fontFamily.medium,
  };

  // Size-specific text styles
  const sizeStyle = getTextSizeStyle(size);
  
  // Color based on variant
  let color: string;
  switch (variant) {
    case 'primary':
      color = Theme.colors.card;
      break;
    default:
      color = Theme.colors[colorName];
  }

  return {
    ...baseStyle,
    ...sizeStyle,
    color,
    opacity: disabled ? Theme.opacity.disabled : 1,
  };
};

const getSizeStyle = (size: ButtonSize): ViewStyle => {
  switch (size) {
    case 'small':
      return {
        paddingVertical: Theme.spacing.xs,
        paddingHorizontal: Theme.spacing.md,
        minWidth: 80,
      };
    case 'medium':
      return {
        paddingVertical: Theme.spacing.sm,
        paddingHorizontal: Theme.spacing.md,
        minWidth: 120,
      };
    case 'large':
      return {
        paddingVertical: Theme.spacing.md,
        paddingHorizontal: Theme.spacing.lg,
        minWidth: 160,
      };
    default:
      return {};
  }
};

const getTextSizeStyle = (size: ButtonSize): TextStyle => {
  switch (size) {
    case 'small':
      return {
        fontSize: Theme.typography.fontSize.sm,
      };
    case 'medium':
      return {
        fontSize: Theme.typography.fontSize.md,
      };
    case 'large':
      return {
        fontSize: Theme.typography.fontSize.lg,
      };
    default:
      return {};
  }
};

export default Button; 