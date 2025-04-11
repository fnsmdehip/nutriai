import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Animated,
  Dimensions,
  ViewProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../../utils/theme';

interface GhibliBackgroundProps extends ViewProps {
  variant?: 'light' | 'dark' | 'nature';
  animated?: boolean;
  intensity?: number; // 0-1, controls the opacity/intensity of the texture
  children?: React.ReactNode;
}

const { width, height } = Dimensions.get('window');

const GhibliBackground: React.FC<GhibliBackgroundProps> = ({
  variant = 'light',
  animated = true,
  intensity = 0.08,
  children,
  style,
  ...props
}) => {
  // Animated values for floating elements
  const floatAnim1 = React.useRef(new Animated.Value(0)).current;
  const floatAnim2 = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    if (animated) {
      // Animation for the first floating element
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim1, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim1, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Animation for the second floating element with a slight delay
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim2, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim2, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated, floatAnim1, floatAnim2]);
  
  // Generate different colors based on the variant
  const getGradientColors = () => {
    switch (variant) {
      case 'dark':
        return ['#1A2C42', '#2C3E50'];
      case 'nature':
        return ['#8EC5FC', '#E0C3FC'];
      default: // light
        return ['#FFFFFF', '#F5F7FA'];
    }
  };
  
  // Get texture image based on variant
  const getTextureImage = () => {
    switch (variant) {
      case 'dark':
        return require('../../assets/textures/dark-texture.png');
      case 'nature':
        return require('../../assets/textures/nature-texture.png');
      default: // light
        return require('../../assets/textures/light-texture.png');
    }
  };
  
  // Calculate animated values for floating elements
  const translateY1 = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });
  
  const translateY2 = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });
  
  return (
    <View style={[styles.container, style]} {...props}>
      <LinearGradient 
        colors={getGradientColors()}
        style={styles.gradient}
      >
        <ImageBackground
          source={getTextureImage()}
          style={[styles.texture, { opacity: intensity }]}
          resizeMode="repeat"
        >
          {animated && (
            <>
              <Animated.View 
                style={[
                  styles.floatingElement1,
                  { transform: [{ translateY: translateY1 }] }
                ]}
              />
              <Animated.View 
                style={[
                  styles.floatingElement2,
                  { transform: [{ translateY: translateY2 }] }
                ]}
              />
            </>
          )}
          {children}
        </ImageBackground>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  texture: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  floatingElement1: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: height * 0.1,
    left: width * 0.2,
  },
  floatingElement2: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: height * 0.2,
    right: width * 0.15,
  },
});

export default GhibliBackground; 