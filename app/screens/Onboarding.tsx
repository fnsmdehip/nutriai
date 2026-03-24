import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '../store/hooks';
import { completeOnboarding, setGender, setGoal } from '../store/userSlice';
import { Theme } from '../utils/theme';

const STEPS = [
  'Welcome',
  'Gender',
  'Workout Frequency',
  'Height & Weight',
  'Birthdate',
  'Goal',
  'Diet Type',
  'Obstacles',
] as const;

const OnboardingScreen = (): React.JSX.Element => {
  const [step, setStep] = useState(0);
  const dispatch = useAppDispatch();

  const handleContinue = (): void => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      dispatch(setGender('male'));
      dispatch(setGoal('maintain'));
      dispatch(completeOnboarding());
    }
  };

  const progressPercent = step === 0 ? 0 : (step / (STEPS.length - 1)) * 100;

  if (step === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.welcomeContent}>
          <View style={styles.heroIcon}>
            <Ionicons name="nutrition" size={56} color={Theme.colors.primary} />
          </View>
          <Text style={styles.welcomeTitle}>NutriAI</Text>
          <Text style={styles.welcomeSubtitle}>
            AI-powered calorie tracking made effortless
          </Text>

          <View style={styles.welcomeFeatures}>
            {[
              { icon: 'camera' as const, text: 'Snap a photo to log meals' },
              { icon: 'bar-chart' as const, text: 'Track your nutrition goals' },
              { icon: 'sparkles' as const, text: 'AI-powered food recognition' },
            ].map((item) => (
              <View key={item.text} style={styles.welcomeFeatureRow}>
                <View style={styles.welcomeFeatureIcon}>
                  <Ionicons name={item.icon} size={20} color={Theme.colors.primary} />
                </View>
                <Text style={styles.welcomeFeatureText}>{item.text}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.stepContent}>
        <Text style={styles.stepCounter}>Step {step} of {STEPS.length - 1}</Text>
        <Text style={styles.stepTitle}>{STEPS[step]}</Text>
        <Text style={styles.stepDescription}>
          This helps us personalize your nutrition targets and recommendations.
        </Text>

        <View style={styles.placeholderInputArea}>
          <Ionicons name="create-outline" size={32} color={Theme.colors.inactive} />
          <Text style={styles.placeholderText}>
            Input fields for {STEPS[step].toLowerCase()} will appear here
          </Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>
            {step === STEPS.length - 1 ? 'Finish Setup' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  welcomeContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  heroIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  welcomeFeatures: {
    width: '100%',
    gap: 16,
    marginBottom: 48,
  },
  welcomeFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeFeatureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  welcomeFeatureText: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 18,
    borderRadius: Theme.border.radius.large,
    width: '100%',
    alignItems: 'center',
    ...Theme.shadow.medium,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: Theme.typography.fontSize.lg,
  },
  progressBar: {
    height: 4,
    backgroundColor: Theme.colors.border,
    marginHorizontal: 24,
    borderRadius: 2,
    marginTop: 8,
  },
  progressFill: {
    height: 4,
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
  },
  stepContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 40,
  },
  stepCounter: {
    fontSize: 13,
    color: Theme.colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: Theme.typography.fontSize.xxl,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: 40,
  },
  placeholderInputArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
    padding: 40,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.inactive,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default OnboardingScreen;
