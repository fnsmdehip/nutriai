import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../../utils/theme';

interface MacroProgressCircleProps {
  percentage: number;
  color: string;
  size: number;
  strokeWidth: number;
  children?: ReactNode;
  style?: ViewStyle;
}

const MacroProgressCircle: React.FC<MacroProgressCircleProps> = ({
  percentage,
  color,
  size,
  strokeWidth,
  children,
  style,
}) => {
  // Calculate circle dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate stroke dashoffset based on percentage
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {/* Background Circle */}
      <View
        style={[
          styles.backgroundCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: `${color}20`, // 20% opacity of color
          },
        ]}
      />
      
      {/* Progress Circle - using SVG properties with View */}
      <View
        style={[
          styles.progressCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            // These properties mimic SVG stroke-dasharray and stroke-dashoffset
            borderStyle: 'solid',
            opacity: percentage === 0 ? 0 : 1,
            transform: [
              { rotateZ: '-90deg' },
              { rotateY: percentage > 50 ? '0deg' : '180deg' },
            ],
          },
        ]}
      />
      
      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundCircle: {
    position: 'absolute',
  },
  progressCircle: {
    position: 'absolute',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MacroProgressCircle; 