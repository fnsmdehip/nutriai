import React, { useState, useRef, useCallback, useMemo } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '../store/hooks';
import {
  completeOnboarding,
  setGender,
  setAge,
  setHeightCm,
  setWeightKg,
  setGoalWeight,
  setGoal,
  setActivityLevel,
  setCalculatedNutrition,
} from '../store/userSlice';
import type { Gender, Goal, ActivityLevel } from '../store/userSlice';
import { setDailyGoal } from '../store/nutritionSlice';
import { Theme } from '../utils/theme';
import { haptics } from '../utils/haptics';
import {
  calculateFullPlan,
  feetInchesToCm,
  lbsToKg,
  kgToLbs,
  estimateWeeksToGoal,
  getProjectedDate,
} from '../utils/nutrition';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingProps {
  onComplete: () => void;
}

const OnboardingScreen = ({ onComplete }: OnboardingProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Step state
  const [step, setStep] = useState(0);

  // User data
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [age, setAgeVal] = useState(28);
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(10);
  const [weightLbs, setWeightLbs] = useState(170);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityLevel | null>(null);
  const [targetWeightLbs, setTargetWeightLbs] = useState(160);

  // Whether goal needs target weight screen
  const needsTargetWeight = selectedGoal === 'lose' || selectedGoal === 'gain';

  // Dynamic total steps based on goal
  const totalSteps = needsTargetWeight ? 9 : 8;

  // Mapping step index to screen identity
  const getScreenId = (s: number): string => {
    const screens = ['welcome', 'gender', 'age', 'measurements', 'goal', 'activity'];
    if (needsTargetWeight) {
      return [...screens, 'targetWeight', 'plan', 'paywall'][s] ?? 'welcome';
    }
    return [...screens, 'plan', 'paywall'][s] ?? 'welcome';
  };

  const screenId = getScreenId(step);

  // Calculated plan
  const plan = useMemo(() => {
    if (!selectedGender || !selectedGoal || !selectedActivity) return null;
    const heightCm = feetInchesToCm(heightFeet, heightInches);
    const weightKg = lbsToKg(weightLbs);
    return calculateFullPlan(
      selectedGender,
      age,
      heightCm,
      weightKg,
      selectedGoal,
      selectedActivity,
    );
  }, [selectedGender, age, heightFeet, heightInches, weightLbs, selectedGoal, selectedActivity]);

  const projectedWeeks = useMemo(() => {
    if (!selectedGoal || selectedGoal === 'maintain') return 0;
    const currentKg = lbsToKg(weightLbs);
    const targetKg = lbsToKg(targetWeightLbs);
    return estimateWeeksToGoal(currentKg, targetKg, selectedGoal);
  }, [weightLbs, targetWeightLbs, selectedGoal]);

  const projectedDate = useMemo(() => {
    if (projectedWeeks <= 0) return '';
    return getProjectedDate(projectedWeeks);
  }, [projectedWeeks]);

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

  const canProceed = (): boolean => {
    switch (screenId) {
      case 'gender':
        return selectedGender !== null;
      case 'goal':
        return selectedGoal !== null;
      case 'activity':
        return selectedActivity !== null;
      default:
        return true;
    }
  };

  const handleNext = useCallback(() => {
    haptics.light();
    if (step < totalSteps - 1) {
      animateTransition(step + 1);
    } else {
      // Final step — save everything and complete
      if (plan && selectedGender && selectedGoal && selectedActivity) {
        const heightCm = feetInchesToCm(heightFeet, heightInches);
        const weightKg = lbsToKg(weightLbs);

        dispatch(setGender(selectedGender));
        dispatch(setAge(age));
        dispatch(setHeightCm(heightCm));
        dispatch(setWeightKg(weightKg));
        dispatch(setGoal(selectedGoal));
        dispatch(setActivityLevel(selectedActivity));

        if (needsTargetWeight) {
          dispatch(setGoalWeight(lbsToKg(targetWeightLbs)));
        } else {
          dispatch(setGoalWeight(null));
        }

        dispatch(
          setCalculatedNutrition({
            dailyCalories: plan.dailyCalories,
            proteinGoal: plan.protein,
            carbGoal: plan.carbs,
            fatGoal: plan.fat,
          }),
        );

        dispatch(
          setDailyGoal({
            calories: plan.dailyCalories,
            protein: plan.protein,
            carbs: plan.carbs,
            fat: plan.fat,
          }),
        );

        dispatch(completeOnboarding());
        haptics.success();
        onComplete();
      }
    }
  }, [
    step,
    totalSteps,
    plan,
    selectedGender,
    selectedGoal,
    selectedActivity,
    heightFeet,
    heightInches,
    weightLbs,
    age,
    needsTargetWeight,
    targetWeightLbs,
    dispatch,
    animateTransition,
    onComplete,
  ]);

  const handleBack = useCallback(() => {
    haptics.light();
    if (step > 0) {
      animateTransition(step - 1);
    }
  }, [step, animateTransition]);

  const progressPercent = step === 0 ? 0 : (step / (totalSteps - 1)) * 100;

  // ============================================
  // SCREEN RENDERERS
  // ============================================

  const renderWelcome = (): React.JSX.Element => (
    <ScrollView contentContainerStyle={styles.welcomeContent} showsVerticalScrollIndicator={false}>
      <View style={styles.welcomeHero}>
        <View style={styles.heroGlowOuter}>
          <View style={styles.heroGlowRing}>
            <View style={styles.heroIconCircle}>
              <Ionicons name="leaf" size={48} color={Theme.colors.primary} />
            </View>
          </View>
        </View>
        <Text style={styles.welcomeTitle}>Track Nutrition{'\n'}With Your Camera</Text>
        <Text style={styles.welcomeSubtitle}>
          Get a personalized calorie and macro plan based on your body, goals, and lifestyle
        </Text>
      </View>

      <View style={styles.featureList}>
        {[
          {
            icon: 'body' as const,
            title: 'Personalized Plan',
            desc: 'Targets based on your exact profile',
          },
          {
            icon: 'camera' as const,
            title: 'AI Food Scanner',
            desc: 'Snap a photo, get instant macros',
          },
          {
            icon: 'trending-up' as const,
            title: 'Track Progress',
            desc: 'Watch your body transform',
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

  const renderGender = (): React.JSX.Element => (
    <ScrollView
      contentContainerStyle={styles.stepScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.stepTitle}>What's your biological sex?</Text>
      <Text style={styles.stepSubtitle}>This affects your metabolic rate calculation</Text>
      <View style={styles.genderGrid}>
        {[
          { key: 'male' as Gender, label: 'Male', icon: 'male' as const },
          { key: 'female' as Gender, label: 'Female', icon: 'female' as const },
          { key: 'other' as Gender, label: 'Other', icon: 'person' as const },
        ].map(opt => {
          const isSelected = selectedGender === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.genderCard, isSelected && styles.genderCardSelected]}
              onPress={() => {
                haptics.selection();
                setSelectedGender(opt.key);
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.genderIconWrap, isSelected && styles.genderIconWrapSelected]}>
                <Ionicons
                  name={opt.icon}
                  size={36}
                  color={isSelected ? Theme.colors.primary : Theme.colors.textSecondary}
                />
              </View>
              <Text style={[styles.genderLabel, isSelected && styles.genderLabelSelected]}>
                {opt.label}
              </Text>
              {isSelected && (
                <View style={styles.selectedCheck}>
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderAge = (): React.JSX.Element => (
    <ScrollView
      contentContainerStyle={styles.stepScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.stepTitle}>How old are you?</Text>
      <Text style={styles.stepSubtitle}>Age is a key factor in your metabolic rate</Text>
      <View style={styles.stepperContainer}>
        <TouchableOpacity
          style={styles.stepperButton}
          onPress={() => {
            haptics.light();
            setAgeVal(Math.max(18, age - 1));
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="remove" size={32} color={Theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.stepperValueWrap}>
          <Text style={styles.stepperValue}>{age}</Text>
          <Text style={styles.stepperUnit}>years</Text>
        </View>
        <TouchableOpacity
          style={styles.stepperButton}
          onPress={() => {
            haptics.light();
            setAgeVal(Math.min(80, age + 1));
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={32} color={Theme.colors.text} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderMeasurements = (): React.JSX.Element => (
    <ScrollView
      contentContainerStyle={styles.stepScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.stepTitle}>Your measurements</Text>
      <Text style={styles.stepSubtitle}>Used to calculate your exact calorie needs</Text>

      {/* Height */}
      <View style={styles.measureSection}>
        <Text style={styles.measureLabel}>Height</Text>
        <View style={styles.measureRow}>
          <View style={styles.measureGroup}>
            <TouchableOpacity
              style={styles.measureBtn}
              onPress={() => {
                haptics.light();
                setHeightFeet(Math.max(4, heightFeet - 1));
              }}
            >
              <Ionicons name="remove" size={24} color={Theme.colors.text} />
            </TouchableOpacity>
            <View style={styles.measureValueWrap}>
              <Text style={styles.measureValue}>{heightFeet}</Text>
              <Text style={styles.measureUnit}>ft</Text>
            </View>
            <TouchableOpacity
              style={styles.measureBtn}
              onPress={() => {
                haptics.light();
                setHeightFeet(Math.min(7, heightFeet + 1));
              }}
            >
              <Ionicons name="add" size={24} color={Theme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.measureGroup}>
            <TouchableOpacity
              style={styles.measureBtn}
              onPress={() => {
                haptics.light();
                setHeightInches(Math.max(0, heightInches - 1));
              }}
            >
              <Ionicons name="remove" size={24} color={Theme.colors.text} />
            </TouchableOpacity>
            <View style={styles.measureValueWrap}>
              <Text style={styles.measureValue}>{heightInches}</Text>
              <Text style={styles.measureUnit}>in</Text>
            </View>
            <TouchableOpacity
              style={styles.measureBtn}
              onPress={() => {
                haptics.light();
                setHeightInches(Math.min(11, heightInches + 1));
              }}
            >
              <Ionicons name="add" size={24} color={Theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Weight */}
      <View style={styles.measureSection}>
        <Text style={styles.measureLabel}>Weight</Text>
        <View style={styles.stepperContainer}>
          <TouchableOpacity
            style={styles.stepperButton}
            onPress={() => {
              haptics.light();
              setWeightLbs(Math.max(80, weightLbs - 1));
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={32} color={Theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.stepperValueWrap}>
            <Text style={styles.stepperValue}>{weightLbs}</Text>
            <Text style={styles.stepperUnit}>lbs</Text>
          </View>
          <TouchableOpacity
            style={styles.stepperButton}
            onPress={() => {
              haptics.light();
              setWeightLbs(Math.min(400, weightLbs + 1));
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={32} color={Theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderGoalSelection = (): React.JSX.Element => (
    <ScrollView
      contentContainerStyle={styles.stepScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.stepTitle}>What's your goal?</Text>
      <Text style={styles.stepSubtitle}>We'll adjust your calories to match</Text>
      <View style={styles.goalList}>
        {[
          {
            key: 'lose' as Goal,
            label: 'Lose Weight',
            icon: 'trending-down' as const,
            desc: 'Reduce body fat with a calorie deficit',
          },
          {
            key: 'maintain' as Goal,
            label: 'Maintain Weight',
            icon: 'swap-horizontal' as const,
            desc: 'Stay at your current weight',
          },
          {
            key: 'gain' as Goal,
            label: 'Build Muscle',
            icon: 'trending-up' as const,
            desc: 'Gain lean mass with a calorie surplus',
          },
        ].map(g => {
          const isSelected = selectedGoal === g.key;
          return (
            <TouchableOpacity
              key={g.key}
              style={[styles.goalCard, isSelected && styles.goalCardSelected]}
              onPress={() => {
                haptics.selection();
                setSelectedGoal(g.key);
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.goalIconWrap, isSelected && styles.goalIconWrapSelected]}>
                <Ionicons
                  name={g.icon}
                  size={28}
                  color={isSelected ? Theme.colors.primary : Theme.colors.textSecondary}
                />
              </View>
              <View style={styles.goalTextBlock}>
                <Text style={[styles.goalLabel, isSelected && styles.goalLabelSelected]}>
                  {g.label}
                </Text>
                <Text style={styles.goalDesc}>{g.desc}</Text>
              </View>
              {isSelected && (
                <View style={styles.selectedCheck}>
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderActivityLevel = (): React.JSX.Element => (
    <ScrollView
      contentContainerStyle={styles.stepScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.stepTitle}>How active are you?</Text>
      <Text style={styles.stepSubtitle}>This determines your daily energy expenditure</Text>
      <View style={styles.activityList}>
        {[
          {
            key: 'sedentary' as ActivityLevel,
            label: 'Sedentary',
            desc: 'Desk job, little exercise',
          },
          {
            key: 'light' as ActivityLevel,
            label: 'Lightly Active',
            desc: 'Light exercise 1-3x/week',
          },
          {
            key: 'moderate' as ActivityLevel,
            label: 'Moderately Active',
            desc: 'Moderate exercise 3-5x/week',
          },
          {
            key: 'very_active' as ActivityLevel,
            label: 'Very Active',
            desc: 'Hard exercise 6-7x/week',
          },
          {
            key: 'athlete' as ActivityLevel,
            label: 'Athlete',
            desc: '2x/day training or physical job',
          },
        ].map(a => {
          const isSelected = selectedActivity === a.key;
          return (
            <TouchableOpacity
              key={a.key}
              style={[styles.activityCard, isSelected && styles.activityCardSelected]}
              onPress={() => {
                haptics.selection();
                setSelectedActivity(a.key);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.activityTextBlock}>
                <Text style={[styles.activityLabel, isSelected && styles.activityLabelSelected]}>
                  {a.label}
                </Text>
                <Text style={styles.activityDesc}>{a.desc}</Text>
              </View>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={24} color={Theme.colors.primary} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderTargetWeight = (): React.JSX.Element => (
    <ScrollView
      contentContainerStyle={styles.stepScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.stepTitle}>What's your target weight?</Text>
      <Text style={styles.stepSubtitle}>
        {selectedGoal === 'lose'
          ? 'We recommend losing 1-2 lbs per week for sustainable results'
          : 'We recommend gaining 0.5-1 lb per week for lean muscle'}
      </Text>
      <View style={styles.stepperContainer}>
        <TouchableOpacity
          style={styles.stepperButton}
          onPress={() => {
            haptics.light();
            setTargetWeightLbs(Math.max(80, targetWeightLbs - 1));
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="remove" size={32} color={Theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.stepperValueWrap}>
          <Text style={styles.stepperValue}>{targetWeightLbs}</Text>
          <Text style={styles.stepperUnit}>lbs</Text>
        </View>
        <TouchableOpacity
          style={styles.stepperButton}
          onPress={() => {
            haptics.light();
            setTargetWeightLbs(Math.min(400, targetWeightLbs + 1));
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={32} color={Theme.colors.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.targetNote}>
        <Text style={styles.targetNoteText}>
          Current weight: {weightLbs} lbs {'\u2192'} Goal: {targetWeightLbs} lbs
        </Text>
        <Text style={styles.targetNoteSub}>
          {Math.abs(weightLbs - targetWeightLbs)} lbs{' '}
          {selectedGoal === 'lose' ? 'to lose' : 'to gain'}
        </Text>
      </View>
    </ScrollView>
  );

  const renderPlan = (): React.JSX.Element => {
    const displayPlan = plan ?? { dailyCalories: 2000, protein: 150, carbs: 200, fat: 70 };
    const goalLabels: Record<string, string> = {
      lose: 'lose weight',
      maintain: 'maintain weight',
      gain: 'build muscle',
    };
    const goalLabel = selectedGoal ? goalLabels[selectedGoal] : 'reach your goals';

    return (
      <ScrollView contentContainerStyle={styles.planContent} showsVerticalScrollIndicator={false}>
        <View style={styles.planBadge}>
          <Ionicons name="sparkles" size={16} color={Theme.colors.primary} />
          <Text style={styles.planBadgeText}>Your Personalized Plan</Text>
        </View>

        <Text style={styles.planCalorieNumber}>{displayPlan.dailyCalories.toLocaleString()}</Text>
        <Text style={styles.planCalorieUnit}>calories per day</Text>

        <Text style={styles.planGoalText}>
          Based on your profile, we recommend{' '}
          <Text style={{ color: Theme.colors.primary, fontWeight: '600' }}>
            {displayPlan.dailyCalories.toLocaleString()} calories
          </Text>{' '}
          to {goalLabel}
        </Text>

        {/* Macro bars */}
        <View style={styles.macroBarsContainer}>
          {[
            {
              label: 'Protein',
              value: displayPlan.protein,
              color: Theme.colors.protein,
              pct: Math.round(((displayPlan.protein * 4) / displayPlan.dailyCalories) * 100),
            },
            {
              label: 'Carbs',
              value: displayPlan.carbs,
              color: Theme.colors.carbs,
              pct: Math.round(((displayPlan.carbs * 4) / displayPlan.dailyCalories) * 100),
            },
            {
              label: 'Fat',
              value: displayPlan.fat,
              color: Theme.colors.fat,
              pct: Math.round(((displayPlan.fat * 9) / displayPlan.dailyCalories) * 100),
            },
          ].map(m => (
            <View key={m.label} style={styles.macroBarRow}>
              <View style={styles.macroBarLabel}>
                <Text style={styles.macroBarLabelText}>{m.label}</Text>
                <Text style={styles.macroBarValue}>{m.value}g</Text>
              </View>
              <View style={styles.macroBarTrack}>
                <View
                  style={[styles.macroBarFill, { width: `${m.pct}%`, backgroundColor: m.color }]}
                />
              </View>
              <Text style={styles.macroBarPct}>{m.pct}%</Text>
            </View>
          ))}
        </View>

        {/* Projected timeline */}
        {needsTargetWeight && projectedWeeks > 0 && (
          <View style={styles.projectionCard}>
            <Ionicons name="calendar" size={20} color={Theme.colors.primary} />
            <View style={styles.projectionText}>
              <Text style={styles.projectionTitle}>
                You'll reach {targetWeightLbs} lbs by {projectedDate}
              </Text>
              <Text style={styles.projectionSub}>
                {projectedWeeks} weeks at a healthy, sustainable pace
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderStepContent = (): React.JSX.Element => {
    switch (screenId) {
      case 'welcome':
        return renderWelcome();
      case 'gender':
        return renderGender();
      case 'age':
        return renderAge();
      case 'measurements':
        return renderMeasurements();
      case 'goal':
        return renderGoalSelection();
      case 'activity':
        return renderActivityLevel();
      case 'targetWeight':
        return renderTargetWeight();
      case 'plan':
        return renderPlan();
      case 'paywall':
        return renderPlan(); // paywall is handled by App.tsx phase
      default:
        return renderWelcome();
    }
  };

  const getButtonText = (): string => {
    if (step === 0) return 'Get Started';
    if (screenId === 'plan') return 'See My Plan';
    if (step === totalSteps - 1) return 'Continue';
    return 'Continue';
  };

  return (
    <View style={styles.container}>
      {/* Gradient background at top */}
      <LinearGradient
        colors={['#0F2240', '#0B1A2E', '#0B1A2E']}
        style={styles.gradientBg}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Progress bar — thin green line at top */}
        {step > 0 && (
          <View style={styles.progressBarOuter}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        )}

        {/* Top bar */}
        {step > 0 && (
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={handleBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-back" size={24} color={Theme.colors.text} />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <Text style={styles.stepIndicator}>
              {step} of {totalSteps - 1}
            </Text>
          </View>
        )}

        {/* Animated content */}
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

        {/* Bottom CTA */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.continueButton, !canProceed() && styles.continueButtonDisabled]}
            onPress={handleNext}
            disabled={!canProceed()}
            activeOpacity={0.85}
          >
            <Text style={styles.continueButtonText}>{getButtonText()}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          {step === 0 && (
            <Text style={styles.termsText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  safeArea: {
    flex: 1,
  },

  // Progress bar
  progressBarOuter: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  progressBarFill: {
    height: 3,
    backgroundColor: Theme.colors.primary,
    borderRadius: 1.5,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIndicator: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },

  animatedContent: {
    flex: 1,
  },

  // Bottom bar
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
    borderRadius: 16,
    gap: 8,
    ...Theme.shadow.medium,
  },
  continueButtonDisabled: {
    opacity: 0.35,
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

  // ========== Welcome ==========
  welcomeContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 20,
  },
  welcomeHero: {
    alignItems: 'center',
    marginBottom: 48,
  },
  heroGlowOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(46, 213, 115, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  heroGlowRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: 'rgba(46, 213, 115, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(46, 213, 115, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Theme.colors.text,
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginTop: 16,
    paddingHorizontal: 8,
    letterSpacing: 0.2,
  },
  featureList: {
    gap: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  featureIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(46, 213, 115, 0.1)',
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

  // ========== Step layout ==========
  stepScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  stepSubtitle: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: 32,
  },

  // ========== Gender ==========
  genderGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  genderCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
  },
  genderCardSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: 'rgba(46, 213, 115, 0.06)',
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  genderIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  genderIconWrapSelected: {
    backgroundColor: 'rgba(46, 213, 115, 0.12)',
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  genderLabelSelected: {
    color: Theme.colors.primary,
  },
  selectedCheck: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ========== Stepper (age, weight) ==========
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 24,
  },
  stepperButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperValueWrap: {
    alignItems: 'center',
    minWidth: 120,
  },
  stepperValue: {
    fontSize: 56,
    fontWeight: '200',
    color: Theme.colors.text,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'] as any,
  },
  stepperUnit: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    marginTop: -4,
    fontWeight: '400',
  },

  // ========== Measurements ==========
  measureSection: {
    marginBottom: 36,
  },
  measureLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: 16,
  },
  measureRow: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },
  measureGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  measureBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  measureValueWrap: {
    alignItems: 'center',
    minWidth: 60,
  },
  measureValue: {
    fontSize: 40,
    fontWeight: '200',
    color: Theme.colors.text,
    letterSpacing: -1,
    fontVariant: ['tabular-nums'] as any,
  },
  measureUnit: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    fontWeight: '400',
    marginTop: -2,
  },

  // ========== Goal ==========
  goalList: {
    gap: 12,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
  },
  goalCardSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: 'rgba(46, 213, 115, 0.06)',
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  goalIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goalIconWrapSelected: {
    backgroundColor: 'rgba(46, 213, 115, 0.12)',
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
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginTop: 3,
    lineHeight: 20,
  },

  // ========== Activity ==========
  activityList: {
    gap: 10,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    padding: 18,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  activityCardSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: 'rgba(46, 213, 115, 0.06)',
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  activityTextBlock: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  activityLabelSelected: {
    color: Theme.colors.primary,
  },
  activityDesc: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },

  // ========== Target Weight ==========
  targetNote: {
    marginTop: 40,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  targetNoteText: {
    fontSize: 16,
    color: Theme.colors.text,
    fontWeight: '500',
  },
  targetNoteSub: {
    fontSize: 14,
    color: Theme.colors.primary,
    marginTop: 4,
    fontWeight: '600',
  },

  // ========== Plan (Value Moment) ==========
  planContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 20,
    alignItems: 'center',
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 213, 115, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
    marginBottom: 24,
  },
  planBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.primary,
    letterSpacing: 0.3,
  },
  planCalorieNumber: {
    fontSize: 72,
    fontWeight: '200',
    color: Theme.colors.text,
    letterSpacing: -3,
    lineHeight: 80,
    fontVariant: ['tabular-nums'] as any,
  },
  planCalorieUnit: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    marginTop: 4,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  planGoalText: {
    fontSize: 15,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 20,
    marginBottom: 32,
    paddingHorizontal: 8,
  },

  // Macro bars
  macroBarsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  macroBarRow: {
    gap: 6,
  },
  macroBarLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroBarLabelText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  macroBarValue: {
    fontSize: 15,
    color: Theme.colors.text,
    fontWeight: '700',
    fontVariant: ['tabular-nums'] as any,
  },
  macroBarTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  macroBarFill: {
    height: 10,
    borderRadius: 5,
  },
  macroBarPct: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    textAlign: 'right',
    fontVariant: ['tabular-nums'] as any,
  },

  // Projection
  projectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 213, 115, 0.06)',
    borderRadius: 14,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(46, 213, 115, 0.15)',
    width: '100%',
  },
  projectionText: {
    flex: 1,
  },
  projectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.text,
    lineHeight: 21,
  },
  projectionSub: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
});

export default OnboardingScreen;
