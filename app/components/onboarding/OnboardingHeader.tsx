import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../../utils/theme';

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  currentStep,
  totalSteps,
  showBackButton = true,
  onBackPress,
}) => {
  const navigation = useNavigation();
  const progress = (currentStep / totalSteps) * 100;
  
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };
  
  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
        >
          <View style={styles.backArrow}>
            <View style={styles.backArrowLine1} />
            <View style={styles.backArrowLine2} />
          </View>
        </TouchableOpacity>
      )}
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.spacing.l,
    paddingTop: Theme.spacing.m,
    paddingBottom: Theme.spacing.s,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.m,
  },
  backArrow: {
    width: 10,
    height: 16,
    position: 'relative',
  },
  backArrowLine1: {
    width: 10,
    height: 2,
    backgroundColor: Theme.colors.text,
    position: 'absolute',
    top: 4,
    left: 0,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
  },
  backArrowLine2: {
    width: 10,
    height: 2,
    backgroundColor: Theme.colors.text,
    position: 'absolute',
    bottom: 4,
    left: 0,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: Theme.colors.card,
    borderRadius: 2,
    marginRight: Theme.spacing.m,
  },
  progressBar: {
    height: 4,
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: Theme.typography.fontSize.small,
    fontWeight: '600',
    color: Theme.colors.text,
    width: 40,
    textAlign: 'right',
  },
});

export default OnboardingHeader; 