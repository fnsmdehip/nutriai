import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';

import { Theme } from '../utils/theme';
import { useAppDispatch } from '../store/hooks';
import { setSubscriptionTier, setSubscriptionLoading } from '../store/subscriptionSlice';
import type { SubscriptionTier } from '../store/subscriptionSlice';

type PlanKey = 'monthly' | 'yearly' | 'lifetime';

interface PlanDisplay {
  key: PlanKey;
  title: string;
  price: string;
  period: string;
  perWeek: string;
  savings: string | null;
  badge: string | null;
  highlighted: boolean;
}

const PLANS: PlanDisplay[] = [
  {
    key: 'monthly',
    title: 'Monthly',
    price: '$9.99',
    period: '/month',
    perWeek: '$2.50/week',
    savings: null,
    badge: null,
    highlighted: false,
  },
  {
    key: 'yearly',
    title: 'Annual',
    price: '$49.99',
    period: '/year',
    perWeek: '$0.96/week',
    savings: 'Save 58%',
    badge: 'BEST VALUE',
    highlighted: true,
  },
  {
    key: 'lifetime',
    title: 'Lifetime',
    price: '$99.99',
    period: 'one-time',
    perWeek: 'Pay once, own forever',
    savings: null,
    badge: null,
    highlighted: false,
  },
];

const FEATURES: Array<{ icon: keyof typeof Ionicons.glyphMap; title: string; description: string }> = [
  {
    icon: 'camera',
    title: 'Unlimited AI Food Scans',
    description: 'Scan any meal with no daily limits',
  },
  {
    icon: 'bar-chart',
    title: 'Advanced Analytics',
    description: 'Weekly, monthly trends and insights',
  },
  {
    icon: 'barcode',
    title: 'Barcode Scanning',
    description: 'Instantly look up packaged foods',
  },
  {
    icon: 'restaurant',
    title: 'Personalized Meal Plans',
    description: 'AI-generated plans for your goals',
  },
  {
    icon: 'ban',
    title: 'Ad-Free Experience',
    description: 'No interruptions, ever',
  },
];

const PaywallScreen = (): React.JSX.Element => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const dispatch = useAppDispatch();

  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('yearly');
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = useCallback(async (): Promise<void> => {
    try {
      setIsPurchasing(true);
      dispatch(setSubscriptionLoading(true));

      // Simulate purchase flow (in production, call RevenueCat purchasePackage)
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 2000);
      });

      dispatch(setSubscriptionTier(selectedPlan as SubscriptionTier));
      Alert.alert(
        'Welcome to Premium!',
        'You now have access to all premium features.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch {
      Alert.alert('Purchase Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsPurchasing(false);
      dispatch(setSubscriptionLoading(false));
    }
  }, [selectedPlan, dispatch, navigation]);

  const handleRestore = useCallback(async (): Promise<void> => {
    try {
      setIsPurchasing(true);

      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1500);
      });

      Alert.alert(
        'No Subscription Found',
        'We could not find an active subscription to restore.'
      );
    } catch {
      Alert.alert('Restore Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Close button */}
      <View style={styles.topBar}>
        <View style={styles.topBarSpacer} />
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={Theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIconRing}>
            <Ionicons name="star" size={36} color={Theme.colors.premium} />
          </View>
          <Text style={styles.heroTitle}>Unlock NutriAI Premium</Text>
          <Text style={styles.heroSubtitle}>
            Unlimited scans, advanced analytics, and personalized nutrition plans
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          {FEATURES.map((feature) => (
            <View key={feature.title} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon} size={20} color={Theme.colors.primary} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Plan selection */}
        <View style={styles.plansSection}>
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.key;
            return (
              <TouchableOpacity
                key={plan.key}
                style={[
                  styles.planCard,
                  isSelected && styles.planCardSelected,
                  plan.highlighted && styles.planCardHighlighted,
                ]}
                onPress={() => setSelectedPlan(plan.key)}
                activeOpacity={0.8}
              >
                {plan.badge && (
                  <View style={styles.planBadge}>
                    <Text style={styles.planBadgeText}>{plan.badge}</Text>
                  </View>
                )}

                <View style={styles.planRadio}>
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </View>

                <View style={styles.planInfo}>
                  <Text style={[styles.planTitle, isSelected && styles.planTitleSelected]}>
                    {plan.title}
                  </Text>
                  <Text style={styles.planPerWeek}>{plan.perWeek}</Text>
                </View>

                <View style={styles.planPriceContainer}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planPeriod}>{plan.period}</Text>
                </View>

                {plan.savings && (
                  <View style={styles.savingsTag}>
                    <Text style={styles.savingsText}>{plan.savings}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Purchase CTA */}
        <TouchableOpacity
          style={[styles.purchaseButton, isPurchasing && styles.purchaseButtonDisabled]}
          onPress={handlePurchase}
          disabled={isPurchasing}
          activeOpacity={0.85}
        >
          {isPurchasing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.purchaseButtonText}>Start Premium</Text>
          )}
        </TouchableOpacity>

        {/* Restore */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={isPurchasing}
        >
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>

        {/* Legal */}
        <Text style={styles.legalText}>
          Payment will be charged to your Apple ID account at confirmation of purchase.
          Subscription automatically renews unless canceled at least 24 hours before the
          end of the current period. You can manage and cancel your subscriptions by going
          to your account settings on the App Store after purchase.
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
  topBarSpacer: {
    flex: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  // Hero
  hero: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 32,
  },
  heroIconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: Theme.typography.fontSize.xxl,
    fontWeight: '700',
    color: Theme.colors.text,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
    paddingHorizontal: 8,
  },

  // Features
  featuresSection: {
    marginBottom: 28,
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  featureDesc: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 1,
  },

  // Plans
  plansSection: {
    gap: 12,
    marginBottom: 24,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
    padding: 16,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    position: 'relative',
    overflow: 'hidden',
    ...Theme.shadow.small,
  },
  planCardSelected: {
    borderColor: Theme.colors.primary,
  },
  planCardHighlighted: {
    borderColor: Theme.colors.primary,
  },
  planBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  planBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  planRadio: {
    marginRight: 14,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Theme.colors.inactive,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: Theme.colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Theme.colors.primary,
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  planTitleSelected: {
    color: Theme.colors.primary,
  },
  planPerWeek: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  planPriceContainer: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  planPeriod: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  savingsTag: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderTopRightRadius: 8,
  },
  savingsText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // CTA
  purchaseButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 18,
    borderRadius: Theme.border.radius.large,
    alignItems: 'center',
    marginBottom: 14,
    ...Theme.shadow.medium,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '700',
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  restoreText: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.typography.fontSize.sm,
    textDecorationLine: 'underline',
  },
  legalText: {
    fontSize: 11,
    color: Theme.colors.inactive,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default PaywallScreen;
