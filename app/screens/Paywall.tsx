import React, { useEffect, useState, useCallback } from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { PurchasesPackage } from 'react-native-purchases';

import { Theme } from '../utils/theme';
import { useAppDispatch } from '../store/hooks';
import { setSubscriptionTier, setSubscriptionLoading } from '../store/subscriptionSlice';
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
  PurchaseCancelledError,
  OfferingDetails,
} from '../services/purchases';

type PlanKey = 'monthly' | 'yearly' | 'lifetime';

interface PlanDisplay {
  key: PlanKey;
  title: string;
  price: string;
  period: string;
  savings: string | null;
  badge: string | null;
}

const PLAN_DISPLAYS: PlanDisplay[] = [
  {
    key: 'monthly',
    title: 'Monthly',
    price: '$9.99',
    period: '/month',
    savings: null,
    badge: null,
  },
  {
    key: 'yearly',
    title: 'Yearly',
    price: '$49.99',
    period: '/year',
    savings: 'Save 58%',
    badge: 'Most Popular',
  },
  {
    key: 'lifetime',
    title: 'Lifetime',
    price: '$99.99',
    period: 'one-time',
    savings: 'Best Value',
    badge: null,
  },
];

const FEATURES = [
  { icon: 'camera-outline' as const, text: 'Unlimited AI food scans' },
  { icon: 'analytics-outline' as const, text: 'Advanced analytics & trends' },
  { icon: 'barcode-outline' as const, text: 'Barcode scanning' },
  { icon: 'restaurant-outline' as const, text: 'Personalized meal plans' },
  { icon: 'ban-outline' as const, text: 'No advertisements' },
];

const PaywallScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const dispatch = useAppDispatch();

  const [offerings, setOfferingsState] = useState<OfferingDetails | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('yearly');
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      setIsLoading(true);
      const result = await getOfferings();
      setOfferingsState(result);
    } catch (error) {
      console.error('[Paywall] Failed to load offerings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = useCallback(async () => {
    if (!offerings) return;

    const selectedPackage: PurchasesPackage | null = offerings[selectedPlan];
    if (!selectedPackage) {
      Alert.alert('Error', 'Selected plan is not available. Please try another plan.');
      return;
    }

    try {
      setIsPurchasing(true);
      dispatch(setSubscriptionLoading(true));

      const customerInfo = await purchasePackage(selectedPackage);
      const isPremium = customerInfo.entitlements.active['premium'] !== undefined;

      if (isPremium) {
        dispatch(setSubscriptionTier(selectedPlan));
        Alert.alert('Welcome to Premium!', 'You now have access to all premium features.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      if (error instanceof PurchaseCancelledError) {
        // User cancelled - do nothing
        return;
      }
      Alert.alert('Purchase Failed', 'Something went wrong. Please try again later.');
      console.error('[Paywall] Purchase error:', error);
    } finally {
      setIsPurchasing(false);
      dispatch(setSubscriptionLoading(false));
    }
  }, [offerings, selectedPlan, dispatch, navigation]);

  const handleRestore = useCallback(async () => {
    try {
      setIsPurchasing(true);
      const customerInfo = await restorePurchases();
      const isPremium = customerInfo.entitlements.active['premium'] !== undefined;

      if (isPremium) {
        dispatch(setSubscriptionTier('monthly')); // Will be corrected by entitlement check
        Alert.alert('Restored!', 'Your premium subscription has been restored.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('No Subscription Found', 'We could not find an active subscription to restore.');
      }
    } catch (error) {
      Alert.alert('Restore Failed', 'Something went wrong. Please try again later.');
      console.error('[Paywall] Restore error:', error);
    } finally {
      setIsPurchasing(false);
    }
  }, [dispatch, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={Theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="star" size={40} color={Theme.colors.premium} />
          </View>
          <Text style={styles.heroTitle}>Unlock Nutri AI Premium</Text>
          <Text style={styles.heroSubtitle}>
            Get unlimited AI scans, advanced analytics, and personalized meal plans
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={styles.featureIconContainer}>
                <Ionicons name={feature.icon} size={22} color={Theme.colors.primary} />
              </View>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        {/* Plans */}
        {isLoading ? (
          <ActivityIndicator size="large" color={Theme.colors.primary} style={styles.loader} />
        ) : (
          <View style={styles.plansContainer}>
            {PLAN_DISPLAYS.map((plan) => {
              const isSelected = selectedPlan === plan.key;
              return (
                <TouchableOpacity
                  key={plan.key}
                  style={[styles.planCard, isSelected && styles.planCardSelected]}
                  onPress={() => setSelectedPlan(plan.key)}
                  activeOpacity={0.8}
                >
                  {plan.badge && (
                    <View style={styles.badgeContainer}>
                      <Text style={styles.badgeText}>{plan.badge}</Text>
                    </View>
                  )}
                  <View style={styles.radioOuter}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.planTextContainer}>
                    <Text style={[styles.planTitle, isSelected && styles.planTitleSelected]}>
                      {plan.title}
                    </Text>
                    <Text style={styles.planPrice}>
                      {plan.price}
                      <Text style={styles.planPeriod}> {plan.period}</Text>
                    </Text>
                  </View>
                  {plan.savings && (
                    <View style={styles.savingsContainer}>
                      <Text style={styles.savingsText}>{plan.savings}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity
          style={[styles.purchaseButton, isPurchasing && styles.purchaseButtonDisabled]}
          onPress={handlePurchase}
          disabled={isPurchasing || isLoading}
          activeOpacity={0.8}
        >
          {isPurchasing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.purchaseButtonText}>Start Premium</Text>
          )}
        </TouchableOpacity>

        {/* Restore */}
        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore} disabled={isPurchasing}>
          <Text style={styles.restoreButtonText}>Restore Purchases</Text>
        </TouchableOpacity>

        {/* Legal */}
        <Text style={styles.legalText}>
          Payment will be charged to your Apple ID or Google Play account. Subscription automatically
          renews unless cancelled at least 24 hours before the end of the current period.
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: Theme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: Theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text,
    flex: 1,
  },
  loader: {
    marginVertical: 40,
  },
  plansContainer: {
    marginBottom: 24,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    position: 'relative',
    overflow: 'hidden',
    ...Theme.shadow.small,
  },
  planCardSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.primaryLight,
  },
  badgeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Theme.colors.primary,
  },
  planTextContainer: {
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
  planPrice: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginTop: 2,
  },
  planPeriod: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: 'normal',
    color: Theme.colors.textSecondary,
  },
  savingsContainer: {
    backgroundColor: Theme.colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Theme.colors.shadow,
  },
  purchaseButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 18,
    borderRadius: Theme.border.radius.large,
    alignItems: 'center',
    marginBottom: 12,
    ...Theme.shadow.medium,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: 'bold',
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  restoreButtonText: {
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
