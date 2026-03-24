import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';

import { Theme } from '../utils/theme';
import { haptics } from '../utils/haptics';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSubscriptionTier, setSubscriptionLoading } from '../store/subscriptionSlice';
import type { SubscriptionTier } from '../store/subscriptionSlice';

type PlanKey = 'yearly' | 'monthly';

interface PlanDisplay {
  key: PlanKey;
  title: string;
  price: string;
  period: string;
  perDay: string;
  perMonth: string | null;
  badge: string | null;
  trialText: string | null;
}

const PLANS: PlanDisplay[] = [
  {
    key: 'yearly',
    title: 'Annual',
    price: '$29.99',
    period: '/year',
    perDay: '$0.08/day',
    perMonth: '$2.50/mo',
    badge: 'Save 50%',
    trialText: '7-day free trial',
  },
  {
    key: 'monthly',
    title: 'Monthly',
    price: '$4.99',
    period: '/month',
    perDay: '$0.17/day',
    perMonth: null,
    badge: null,
    trialText: null,
  },
];

const FEATURES = [
  { icon: 'infinite-outline' as const, text: 'Unlimited AI food scans' },
  { icon: 'analytics-outline' as const, text: 'Advanced analytics & trends' },
  { icon: 'barcode-outline' as const, text: 'Barcode scanning' },
  { icon: 'restaurant-outline' as const, text: 'AI meal plan generator' },
  { icon: 'ban-outline' as const, text: 'Completely ad-free' },
  { icon: 'sync-outline' as const, text: 'Apple Health integration' },
];

const GOAL_LABELS: Record<string, string> = {
  lose: 'lose weight',
  maintain: 'maintain your weight',
  gain: 'build muscle',
};

const PaywallScreen = (): React.JSX.Element => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const dispatch = useAppDispatch();

  const goal = useAppSelector(state => state.user.userProfile.goal);

  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('yearly');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ctaSlide = useRef(new Animated.Value(30)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    Animated.parallel([
      Animated.timing(ctaSlide, {
        toValue: 0,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(ctaOpacity, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    return () => pulse.stop();
  }, [pulseAnim, ctaSlide, ctaOpacity]);

  const safeGoBack = useCallback((): void => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const handlePurchase = useCallback(async (): Promise<void> => {
    haptics.medium();
    try {
      setIsPurchasing(true);
      dispatch(setSubscriptionLoading(true));

      await new Promise<void>(resolve => {
        setTimeout(resolve, 2000);
      });

      const tierMap: Record<PlanKey, SubscriptionTier> = {
        yearly: 'yearly',
        monthly: 'monthly',
      };

      dispatch(setSubscriptionTier(tierMap[selectedPlan]));
      haptics.success();
      safeGoBack();
    } catch {
      haptics.error();
    } finally {
      setIsPurchasing(false);
      dispatch(setSubscriptionLoading(false));
    }
  }, [selectedPlan, dispatch, safeGoBack]);

  const handleRestore = useCallback(async (): Promise<void> => {
    haptics.light();
    try {
      setIsPurchasing(true);
      await new Promise<void>(resolve => {
        setTimeout(resolve, 1500);
      });
    } finally {
      setIsPurchasing(false);
    }
  }, []);

  const planOrder: PlanKey[] = ['yearly', 'monthly'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.spacer} />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            haptics.light();
            safeGoBack();
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={22} color={Theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroStarField}>
            <Ionicons name="star" size={40} color={Theme.colors.premium} />
          </View>
          <Text style={styles.heroTitle}>Go Premium</Text>
          <Text style={styles.heroSubtitle}>Unlock unlimited AI-powered nutrition tracking</Text>
          {goal && GOAL_LABELS[goal] ? (
            <Text style={styles.personalizedText}>
              Based on your goal to {GOAL_LABELS[goal]}, Premium gives you the insights you need.
            </Text>
          ) : null}
        </View>

        <View style={styles.featuresGrid}>
          {FEATURES.map(f => (
            <View key={f.text} style={styles.featureChip}>
              <Ionicons name={f.icon} size={18} color={Theme.colors.primary} />
              <Text style={styles.featureChipText}>{f.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.plansRow}>
          {planOrder.map(planKey => {
            const plan = PLANS.find(p => p.key === planKey)!;
            const isSelected = selectedPlan === plan.key;
            const isBestValue = plan.badge !== null;

            return (
              <TouchableOpacity
                key={plan.key}
                style={[
                  styles.planCard,
                  isSelected && styles.planCardSelected,
                  isBestValue && isSelected && styles.planCardBest,
                ]}
                onPress={() => {
                  haptics.selection();
                  setSelectedPlan(plan.key);
                }}
                activeOpacity={0.8}
              >
                {plan.badge && (
                  <View style={styles.bestBadge}>
                    <Text style={styles.bestBadgeText}>{plan.badge}</Text>
                  </View>
                )}

                <Text style={[styles.planTitle, isSelected && styles.planTitleSelected]}>
                  {plan.title}
                </Text>

                <Text style={[styles.planPrice, isSelected && styles.planPriceSelected]}>
                  {plan.price}
                </Text>
                <Text style={styles.planPeriod}>{plan.period}</Text>

                {plan.perMonth && <Text style={styles.planPerMonth}>{plan.perMonth}</Text>}

                {plan.trialText && (
                  <View style={styles.trialBadge}>
                    <Text style={styles.trialText}>{plan.trialText}</Text>
                  </View>
                )}

                <Text style={styles.planPerDay}>{plan.perDay}</Text>

                <View style={[styles.planRadio, isSelected && styles.planRadioSelected]}>
                  {isSelected && <View style={styles.planRadioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Animated.View
          style={[
            styles.ctaSection,
            {
              opacity: ctaOpacity,
              transform: [{ translateY: ctaSlide }, { scale: pulseAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.purchaseButton, isPurchasing && styles.purchaseButtonDisabled]}
            onPress={handlePurchase}
            disabled={isPurchasing}
            activeOpacity={0.85}
          >
            {isPurchasing ? (
              <View style={styles.loadingDots}>
                <View style={styles.dot} />
                <View style={[styles.dot, styles.dotDelay1]} />
                <View style={[styles.dot, styles.dotDelay2]} />
              </View>
            ) : (
              <Text style={styles.purchaseButtonText}>
                {selectedPlan === 'yearly' ? 'Start Free Trial' : 'Subscribe Now'}
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.cancelText}>Cancel anytime. No commitment.</Text>

        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={isPurchasing}
        >
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>

        <Text style={styles.legalText}>
          Payment will be charged to your Apple ID account at confirmation of purchase. Subscription
          automatically renews unless canceled at least 24 hours before the end of the current
          period. You can manage and cancel subscriptions in your App Store account settings. Any
          unused portion of a free trial period will be forfeited if you purchase a subscription.
        </Text>
      </ScrollView>
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
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  spacer: { flex: 1 },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 32,
  },

  hero: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  heroStarField: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  personalizedText: {
    fontSize: 14,
    color: Theme.colors.primary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
    fontWeight: '500',
    paddingHorizontal: 16,
  },

  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 28,
    justifyContent: 'center',
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
  },
  featureChipText: {
    fontSize: 13,
    color: Theme.colors.text,
    fontWeight: '500',
  },

  plansRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  planCard: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: 16,
    padding: 14,
    paddingTop: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.border,
    position: 'relative',
    minHeight: 180,
    justifyContent: 'center',
  },
  planCardSelected: {
    borderColor: Theme.colors.primary,
  },
  planCardBest: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.highlight,
    transform: [{ scale: 1.02 }],
  },
  bestBadge: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    backgroundColor: Theme.colors.primary,
    paddingVertical: 4,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    alignItems: 'center',
  },
  bestBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  planTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
    marginBottom: 8,
    marginTop: 6,
  },
  planTitleSelected: {
    color: Theme.colors.text,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  planPriceSelected: {
    color: Theme.colors.primary,
  },
  planPeriod: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  planPerMonth: {
    fontSize: 13,
    color: Theme.colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  trialBadge: {
    backgroundColor: 'rgba(46, 213, 115, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  trialText: {
    fontSize: 11,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  planPerDay: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginTop: 6,
  },
  planRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Theme.colors.inactive,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  planRadioSelected: {
    borderColor: Theme.colors.primary,
  },
  planRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Theme.colors.primary,
  },

  ctaSection: {
    marginBottom: 12,
  },
  purchaseButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 18,
    borderRadius: Theme.border.radius.large,
    alignItems: 'center',
    ...Theme.shadow.large,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 6,
    height: 22,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    opacity: 0.6,
  },
  dotDelay1: {
    opacity: 0.8,
  },
  dotDelay2: {
    opacity: 1,
  },

  cancelText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  restoreText: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  legalText: {
    fontSize: 11,
    color: Theme.colors.inactive,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 8,
  },
});

export default PaywallScreen;
