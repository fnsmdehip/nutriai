import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '../store/hooks';
import { completeOnboarding, setGoal, setDietType } from '../store/userSlice';
import { setDailyGoal } from '../store/nutritionSlice';
import { Theme } from '../utils/theme';
import { haptics } from '../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type DietaryPref = 'regular' | 'keto' | 'vegan' | 'vegetarian' | 'pescatarian' | 'paleo';
type GoalType = 'lose' | 'maintain' | 'gain';

interface DietOption {
  key: DietaryPref;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

interface GoalOption {
  key: GoalType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  calories: number;
  description: string;
}

const DIET_OPTIONS: DietOption[] = [
  {
    key: 'regular',
    label: 'No Restrictions',
    icon: 'restaurant-outline',
    description: 'I eat everything',
  },
  { key: 'keto', label: 'Keto', icon: 'flame-outline', description: 'High fat, low carb' },
  { key: 'vegan', label: 'Vegan', icon: 'leaf-outline', description: 'Plant-based only' },
  {
    key: 'vegetarian',
    label: 'Vegetarian',
    icon: 'nutrition-outline',
    description: 'No meat or fish',
  },
  {
    key: 'pescatarian',
    label: 'Pescatarian',
    icon: 'fish-outline',
    description: 'Vegetarian + fish',
  },
  { key: 'paleo', label: 'Paleo', icon: 'fitness-outline', description: 'Whole foods, no grains' },
];

const GOAL_OPTIONS: GoalOption[] = [
  {
    key: 'lose',
    label: 'Lose Weight',
    icon: 'trending-down-outline',
    calories: 1600,
    description: 'Calorie deficit for steady fat loss',
  },
  {
    key: 'maintain',
    label: 'Maintain Weight',
    icon: 'remove-outline',
    calories: 2000,
    description: 'Stay at your current weight',
  },
  {
    key: 'gain',
    label: 'Build Muscle',
    icon: 'trending-up-outline',
    calories: 2500,
    description: 'Calorie surplus for muscle growth',
  },
];

const CALORIE_GOALS: Record<
  GoalType,
  { calories: number; protein: number; carbs: number; fat: number }
> = {
  lose: { calories: 1600, protein: 140, carbs: 130, fat: 55 },
  maintain: { calories: 2000, protein: 150, carbs: 200, fat: 70 },
  gain: { calories: 2500, protein: 180, carbs: 280, fat: 85 },
};

interface OnboardingProps {
  onComplete: () => void;
}

const OnboardingScreen = ({ onComplete }: OnboardingProps): React.JSX.Element => {
  const [step, setStep] = useState(0);
  const [selectedDiet, setSelectedDiet] = useState<DietaryPref | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
  const dispatch = useAppDispatch();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const totalSteps = 5;

  const animateTransition = useCallback(
    (nextStep: number) => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setStep(nextStep);
        slideAnim.setValue(30);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
      });
    },
    [fadeAnim, slideAnim],
  );

  const handleNext = useCallback(() => {
    haptics.light();
    if (step < totalSteps - 1) {
      animateTransition(step + 1);
    } else {
      if (selectedGoal) {
        const goals = CALORIE_GOALS[selectedGoal];
        dispatch(setDailyGoal(goals));
        dispatch(setGoal(selectedGoal));
      }
      if (selectedDiet) {
        const mappedDiet =
          selectedDiet === 'keto' || selectedDiet === 'paleo' ? 'regular' : selectedDiet;
        dispatch(setDietType(mappedDiet as 'regular' | 'pescatarian' | 'vegetarian' | 'vegan'));
      }
      dispatch(completeOnboarding());
      haptics.success();
      onComplete();
    }
  }, [step, selectedGoal, selectedDiet, dispatch, animateTransition, onComplete]);

  const handleBack = useCallback(() => {
    haptics.light();
    if (step > 0) {
      animateTransition(step - 1);
    }
  }, [step, animateTransition]);

  const canProceed = (): boolean => {
    if (step === 1) return selectedDiet !== null;
    if (step === 2) return selectedGoal !== null;
    return true;
  };

  const progressPercent = ((step + 1) / totalSteps) * 100;

  const renderWelcome = (): React.JSX.Element => (
    <ScrollView contentContainerStyle={styles.welcomeContent} showsVerticalScrollIndicator={false}>
      <View style={styles.welcomeHero}>
        <View style={styles.heroGlowRing}>
          <View style={styles.heroIconCircle}>
            <Text style={styles.heroEmoji}>{'\uD83D\uDCF7'}</Text>
          </View>
        </View>
        <Text style={styles.welcomeTitle}>Track Nutrition{'\n'}With Your Camera</Text>
        <Text style={styles.welcomeSubtitle}>
          Snap a photo of any meal and get instant calorie and macro breakdowns powered by AI
        </Text>
      </View>

      <View style={styles.featureList}>
        {[
          {
            icon: 'camera' as const,
            title: 'Instant AI Recognition',
            desc: 'Point, snap, and know what you ate',
          },
          {
            icon: 'analytics' as const,
            title: 'Detailed Macro Tracking',
            desc: 'Protein, carbs, fat, and calories',
          },
          {
            icon: 'trending-up' as const,
            title: 'Smart Insights',
            desc: 'Weekly trends and personalized tips',
          },
        ].map(feature => (
          <View key={feature.title} style={styles.featureRow}>
            <View style={styles.featureIconCircle}>
              <Ionicons name={feature.icon} size={22} color={Theme.colors.primary} />
            </View>
            <View style={styles.featureTextBlock}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderDietSelection = (): React.JSX.Element => (
    <ScrollView
      contentContainerStyle={styles.stepScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.stepTitle}>What's your diet?</Text>
      <Text style={styles.stepSubtitle}>
        Select your dietary preferences so we can tailor recommendations
      </Text>
      <View style={styles.optionGrid}>
        {DIET_OPTIONS.map(diet => {
          const isSelected = selectedDiet === diet.key;
          return (
            <TouchableOpacity
              key={diet.key}
              style={[styles.optionCard, isSelected && styles.optionCardSelected]}
              onPress={() => {
                haptics.selection();
                setSelectedDiet(diet.key);
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.optionIconWrap, isSelected && styles.optionIconWrapSelected]}>
                <Ionicons
                  name={diet.icon}
                  size={24}
                  color={isSelected ? Theme.colors.primary : Theme.colors.textSecondary}
                />
              </View>
              <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                {diet.label}
              </Text>
              <Text style={styles.optionDesc}>{diet.description}</Text>
              {isSelected && (
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderGoalSelection = (): React.JSX.Element => (
    <ScrollView
      contentContainerStyle={styles.stepScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.stepTitle}>What's your goal?</Text>
      <Text style={styles.stepSubtitle}>
        We'll set a daily calorie target based on your selection
      </Text>
      <View style={styles.goalList}>
        {GOAL_OPTIONS.map(goal => {
          const isSelected = selectedGoal === goal.key;
          return (
            <TouchableOpacity
              key={goal.key}
              style={[styles.goalCard, isSelected && styles.goalCardSelected]}
              onPress={() => {
                haptics.selection();
                setSelectedGoal(goal.key);
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.goalIconWrap, isSelected && styles.goalIconWrapSelected]}>
                <Ionicons
                  name={goal.icon}
                  size={28}
                  color={isSelected ? Theme.colors.primary : Theme.colors.textSecondary}
                />
              </View>
              <View style={styles.goalTextBlock}>
                <Text style={[styles.goalLabel, isSelected && styles.goalLabelSelected]}>
                  {goal.label}
                </Text>
                <Text style={styles.goalDesc}>{goal.description}</Text>
              </View>
              <View style={styles.goalCalories}>
                <Text style={[styles.goalCalNum, isSelected && styles.goalCalNumSelected]}>
                  {goal.calories.toLocaleString()}
                </Text>
                <Text style={styles.goalCalUnit}>cal/day</Text>
              </View>
              {isSelected && (
                <View style={styles.goalCheckmark}>
                  <Ionicons name="checkmark-circle" size={24} color={Theme.colors.primary} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderCalorieCalculator = (): React.JSX.Element => {
    const goals = selectedGoal ? CALORIE_GOALS[selectedGoal] : CALORIE_GOALS.maintain;
    return (
      <ScrollView
        contentContainerStyle={styles.stepScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.stepTitle}>Your Daily Targets</Text>
        <Text style={styles.stepSubtitle}>
          Based on your goals, here are your personalized nutrition targets
        </Text>

        <View style={styles.calorieHero}>
          <View style={styles.calorieRingLarge}>
            <Text style={styles.calorieHeroNumber}>{goals.calories.toLocaleString()}</Text>
            <Text style={styles.calorieHeroUnit}>calories per day</Text>
          </View>
        </View>

        <View style={styles.macroTargets}>
          {[
            { label: 'Protein', value: goals.protein, color: Theme.colors.protein, unit: 'g' },
            { label: 'Carbs', value: goals.carbs, color: Theme.colors.carbs, unit: 'g' },
            { label: 'Fat', value: goals.fat, color: Theme.colors.fat, unit: 'g' },
          ].map(macro => (
            <View key={macro.label} style={styles.macroTargetCard}>
              <View style={[styles.macroTargetDot, { backgroundColor: macro.color }]} />
              <Text style={styles.macroTargetValue}>
                {macro.value}
                {macro.unit}
              </Text>
              <Text style={styles.macroTargetLabel}>{macro.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.adjustNote}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={Theme.colors.textSecondary}
          />
          <Text style={styles.adjustNoteText}>
            You can adjust these targets anytime in Settings
          </Text>
        </View>
      </ScrollView>
    );
  };

  const renderCameraDemo = (): React.JSX.Element => (
    <ScrollView
      contentContainerStyle={styles.stepScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.stepTitle}>How It Works</Text>
      <Text style={styles.stepSubtitle}>Our AI analyzes your food photos in seconds</Text>

      <View style={styles.demoContainer}>
        <View style={styles.demoStep}>
          <View style={styles.demoStepNumber}>
            <Text style={styles.demoStepNumText}>1</Text>
          </View>
          <View style={styles.demoVisual}>
            <View style={styles.demoPhoneFrame}>
              <Ionicons name="camera" size={40} color={Theme.colors.primary} />
              <View style={styles.demoFocusGuide} />
            </View>
          </View>
          <Text style={styles.demoStepTitle}>Snap a Photo</Text>
          <Text style={styles.demoStepDesc}>Point your camera at any meal</Text>
        </View>

        <View style={styles.demoArrow}>
          <Ionicons name="arrow-down" size={24} color={Theme.colors.primary} />
        </View>

        <View style={styles.demoStep}>
          <View style={styles.demoStepNumber}>
            <Text style={styles.demoStepNumText}>2</Text>
          </View>
          <View style={styles.demoVisual}>
            <View style={styles.demoAnalysis}>
              <View style={styles.demoSpinner}>
                <Ionicons name="sparkles" size={32} color={Theme.colors.primary} />
              </View>
              <Text style={styles.demoAnalysisLabel}>AI Analyzing...</Text>
            </View>
          </View>
          <Text style={styles.demoStepTitle}>AI Identifies Food</Text>
          <Text style={styles.demoStepDesc}>Recognizes ingredients and portions</Text>
        </View>

        <View style={styles.demoArrow}>
          <Ionicons name="arrow-down" size={24} color={Theme.colors.primary} />
        </View>

        <View style={styles.demoStep}>
          <View style={styles.demoStepNumber}>
            <Text style={styles.demoStepNumText}>3</Text>
          </View>
          <View style={styles.demoResultCard}>
            <Text style={styles.demoFoodName}>Grilled Chicken Salad</Text>
            <View style={styles.demoMacroRow}>
              <View style={styles.demoMacro}>
                <Text style={styles.demoMacroVal}>350</Text>
                <Text style={styles.demoMacroLbl}>cal</Text>
              </View>
              <View style={styles.demoMacroDivider} />
              <View style={styles.demoMacro}>
                <Text style={[styles.demoMacroVal, { color: Theme.colors.protein }]}>35g</Text>
                <Text style={styles.demoMacroLbl}>protein</Text>
              </View>
              <View style={styles.demoMacroDivider} />
              <View style={styles.demoMacro}>
                <Text style={[styles.demoMacroVal, { color: Theme.colors.carbs }]}>12g</Text>
                <Text style={styles.demoMacroLbl}>carbs</Text>
              </View>
              <View style={styles.demoMacroDivider} />
              <View style={styles.demoMacro}>
                <Text style={[styles.demoMacroVal, { color: Theme.colors.fat }]}>18g</Text>
                <Text style={styles.demoMacroLbl}>fat</Text>
              </View>
            </View>
          </View>
          <Text style={styles.demoStepTitle}>Get Full Breakdown</Text>
          <Text style={styles.demoStepDesc}>Calories and macros logged instantly</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderStepContent = (): React.JSX.Element => {
    switch (step) {
      case 0:
        return renderWelcome();
      case 1:
        return renderDietSelection();
      case 2:
        return renderGoalSelection();
      case 3:
        return renderCalorieCalculator();
      case 4:
        return renderCameraDemo();
      default:
        return renderWelcome();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {step > 0 && (
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color={Theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>
          <Text style={styles.stepIndicator}>
            {step}/{totalSteps - 1}
          </Text>
        </View>
      )}

      <Animated.View
        style={[
          styles.animatedContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {renderStepContent()}
      </Animated.View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.continueButton, !canProceed() && styles.continueButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed()}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>
            {step === 0 ? 'Get Started' : step === totalSteps - 1 ? 'Start Tracking' : 'Continue'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        {step === 0 && (
          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
  },
  stepIndicator: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'right',
  },
  animatedContent: {
    flex: 1,
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 8 : 20,
    paddingTop: 12,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary,
    paddingVertical: 18,
    borderRadius: Theme.border.radius.large,
    gap: 8,
    ...Theme.shadow.medium,
  },
  continueButtonDisabled: {
    opacity: 0.4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  termsText: {
    fontSize: 12,
    color: Theme.colors.inactive,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
  },

  // Welcome screen
  welcomeContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 20,
  },
  welcomeHero: {
    alignItems: 'center',
    marginBottom: 48,
  },
  heroGlowRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: 'rgba(46, 213, 115, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  heroIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadow.medium,
  },
  heroEmoji: {
    fontSize: 48,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Theme.colors.text,
    textAlign: 'center',
    lineHeight: 40,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 12,
    paddingHorizontal: 8,
  },
  featureList: {
    gap: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
    padding: 16,
  },
  featureIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextBlock: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  featureDesc: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },

  // Diet selection
  stepScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: 28,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
    padding: 16,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    position: 'relative',
    minHeight: 120,
  },
  optionCardSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.highlight,
  },
  optionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionIconWrapSelected: {
    backgroundColor: Theme.colors.primaryLight,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  optionLabelSelected: {
    color: Theme.colors.primary,
  },
  optionDesc: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Goal selection
  goalList: {
    gap: 14,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
    padding: 18,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    position: 'relative',
  },
  goalCardSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.highlight,
  },
  goalIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Theme.colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  goalIconWrapSelected: {
    backgroundColor: Theme.colors.primaryLight,
  },
  goalTextBlock: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  goalLabelSelected: {
    color: Theme.colors.primary,
  },
  goalDesc: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  goalCalories: {
    alignItems: 'flex-end',
    marginRight: 4,
  },
  goalCalNum: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  goalCalNumSelected: {
    color: Theme.colors.primary,
  },
  goalCalUnit: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  goalCheckmark: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  // Calorie calculator
  calorieHero: {
    alignItems: 'center',
    marginVertical: 32,
  },
  calorieRingLarge: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 6,
    borderColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    ...Theme.shadow.large,
  },
  calorieHeroNumber: {
    fontSize: 48,
    fontWeight: '200',
    color: Theme.colors.text,
    letterSpacing: -1,
  },
  calorieHeroUnit: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  macroTargets: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  macroTargetCard: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
    padding: 16,
    alignItems: 'center',
  },
  macroTargetDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  macroTargetValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  macroTargetLabel: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  adjustNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
    padding: 16,
  },
  adjustNoteText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    flex: 1,
  },

  // Camera demo
  demoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  demoStep: {
    alignItems: 'center',
    width: '100%',
  },
  demoStepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  demoStepNumText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  demoVisual: {
    marginBottom: 12,
  },
  demoPhoneFrame: {
    width: 160,
    height: 120,
    backgroundColor: Theme.colors.surface,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.border,
  },
  demoFocusGuide: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: 'rgba(46, 213, 115, 0.4)',
    borderRadius: 12,
  },
  demoAnalysis: {
    width: 160,
    height: 80,
    backgroundColor: Theme.colors.surface,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.border,
  },
  demoSpinner: {
    marginBottom: 4,
  },
  demoAnalysisLabel: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },
  demoResultCard: {
    width: '100%',
    backgroundColor: Theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    marginBottom: 12,
  },
  demoFoodName: {
    fontSize: 17,
    fontWeight: '700',
    color: Theme.colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  demoMacroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  demoMacro: {
    alignItems: 'center',
  },
  demoMacroVal: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  demoMacroLbl: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  demoMacroDivider: {
    width: 1,
    height: 30,
    backgroundColor: Theme.colors.border,
  },
  demoArrow: {
    paddingVertical: 4,
  },
  demoStepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
    marginTop: 4,
  },
  demoStepDesc: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
});

export default OnboardingScreen;
