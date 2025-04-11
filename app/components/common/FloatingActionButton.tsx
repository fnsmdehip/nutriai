import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  TouchableOpacityProps,
} from 'react-native';
import { Theme } from '../../utils/theme';

interface FloatingActionButtonProps extends TouchableOpacityProps {
  onPress: () => void;
  onLongPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  onLongPress,
  size = 'medium',
  style,
  ...props
}) => {
  // Size mapping for the button dimensions
  const sizeMap = {
    small: 48,
    medium: 56,
    large: 64,
  };
  
  // Size mapping for the plus icon dimensions
  const iconSizeMap = {
    small: 16,
    medium: 24,
    large: 32,
  };
  
  // Calculate the button size based on the size prop
  const buttonSize = sizeMap[size];
  const iconSize = iconSizeMap[size];
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
        },
        style,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      {...props}
    >
      <View style={styles.plusIcon}>
        <View
          style={[
            styles.horizontalLine,
            { width: iconSize, height: 2 },
          ]}
        />
        <View
          style={[
            styles.verticalLine,
            { width: 2, height: iconSize },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadow.large,
  },
  plusIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  horizontalLine: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    borderRadius: 1,
  },
  verticalLine: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    borderRadius: 1,
  },
});

export default FloatingActionButton; 