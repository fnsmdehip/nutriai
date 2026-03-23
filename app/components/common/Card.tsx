import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Theme } from '../../utils/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 'none' | 'small' | 'medium' | 'large';
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  onPress?: () => void;
  disabled?: boolean;
  withTexture?: boolean;
}

/**
 * A Ghibli-styled card component with soft shadows and subtle textures
 */
const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 'small',
  variant = 'default',
  onPress,
  disabled = false,
  withTexture = true,
}) => {
  // Get background color based on variant
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return Theme.colors.primaryLight;
      case 'secondary':
        return Theme.colors.watercolor;
      case 'accent':
        return Theme.colors.highlight;
      default:
        return Theme.colors.cardBackground;
    }
  };

  // Get shadow styles based on elevation
  const getShadowStyle = () => {
    switch (elevation) {
      case 'large':
        return Theme.shadow.large;
      case 'medium':
        return Theme.shadow.medium;
      case 'none':
        return Theme.shadow.none;
      default: // small
        return Theme.shadow.small;
    }
  };

  const cardStyles = [
    styles.card,
    { backgroundColor: getBackgroundColor() },
    getShadowStyle(),
    disabled && styles.disabled,
    style,
  ];

  // Use different components based on whether there's an onPress handler
  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={disabled ? undefined : onPress}
        activeOpacity={0.9}
        disabled={disabled}
      >
        {withTexture && <View style={styles.texture} />}
        <View style={styles.content}>{children}</View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles}>
      {withTexture && <View style={styles.texture} />}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Theme.border.radius.large,
    padding: Theme.spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  texture: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    opacity: 0.02,
    zIndex: 0,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  disabled: {
    opacity: Theme.opacity.disabled,
  },
});

export default Card; 