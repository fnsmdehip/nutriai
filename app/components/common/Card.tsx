import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import type { ViewStyle } from 'react-native';
import { Theme } from '../../utils/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 'none' | 'small' | 'medium' | 'large';
  onPress?: () => void;
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 'small',
  onPress,
  disabled = false,
}) => {
  const getShadowStyle = (): ViewStyle => {
    switch (elevation) {
      case 'large':
        return Theme.shadow.large as ViewStyle;
      case 'medium':
        return Theme.shadow.medium as ViewStyle;
      case 'none':
        return Theme.shadow.none as ViewStyle;
      default:
        return Theme.shadow.small as ViewStyle;
    }
  };

  const cardStyles: ViewStyle[] = [
    styles.card,
    getShadowStyle(),
    disabled ? styles.disabled : {},
    style ?? {},
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={disabled ? undefined : onPress}
        activeOpacity={0.85}
        disabled={disabled}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
    padding: Theme.spacing.md,
  },
  disabled: {
    opacity: Theme.opacity.disabled,
  },
});

export default Card;
