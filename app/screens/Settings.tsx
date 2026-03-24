import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';

import { Theme } from '../utils/theme';
import { haptics } from '../utils/haptics';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setPremiumStatus } from '../store/subscriptionSlice';

const SettingsScreen = (): React.JSX.Element => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const dispatch = useAppDispatch();

  const isPremium = useAppSelector(state => state.subscription.isPremium);
  const tier = useAppSelector(state => state.subscription.tier);

  const [isRestoring, setIsRestoring] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [healthSyncEnabled, setHealthSyncEnabled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    haptics.light();
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const getTierLabel = (): string => {
    switch (tier) {
      case 'monthly':
        return 'Monthly Plan - $4.99/mo';
      case 'yearly':
        return 'Annual Plan - $29.99/yr';
      case 'lifetime':
        return 'Lifetime Plan';
      default:
        return 'Free Plan - 3 scans/day';
    }
  };

  const handleManageSubscription = (): void => {
    haptics.light();
    if (isPremium) {
      Alert.alert(
        'Manage Subscription',
        'You can manage or cancel your subscription in your App Store settings.',
        [
          {
            text: 'Open App Store Settings',
            onPress: () => Linking.openURL('https://apps.apple.com/account/subscriptions'),
          },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
    } else {
      navigation.navigate('Paywall');
    }
  };

  const handleRestorePurchases = useCallback(async (): Promise<void> => {
    haptics.light();
    try {
      setIsRestoring(true);
      await new Promise<void>(resolve => {
        setTimeout(resolve, 1500);
      });

      Alert.alert(
        'No Subscription Found',
        'We could not find an active subscription to restore. If you believe this is an error, please contact support at support@nutriai.app',
      );
    } catch {
      haptics.error();
      Alert.alert('Restore Failed', 'Something went wrong. Please try again later.');
    } finally {
      setIsRestoring(false);
    }
  }, []);

  const handleCancelSubscription = (): void => {
    haptics.medium();
    Alert.alert(
      'Cancel Subscription',
      'To cancel your subscription, go to your App Store settings. You will continue to have access until the end of your current billing period.',
      [
        {
          text: 'Open App Store Settings',
          onPress: () => Linking.openURL('https://apps.apple.com/account/subscriptions'),
        },
        { text: 'Not Now', style: 'cancel' },
      ],
    );
  };

  type SettingRowProps = {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    trailing?: React.ReactNode;
  };

  const SettingRow = ({
    icon,
    title,
    subtitle,
    onPress,
    trailing,
  }: SettingRowProps): React.JSX.Element => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={() => {
        if (onPress) {
          haptics.light();
          onPress();
        }
      }}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon} size={20} color={Theme.colors.text} />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle ? <Text style={styles.settingSubtitle}>{subtitle}</Text> : null}
      </View>
      {trailing ??
        (onPress ? (
          <Ionicons name="chevron-forward" size={18} color={Theme.colors.inactive} />
        ) : null)}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Theme.colors.primary}
          />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SUBSCRIPTION</Text>
          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionIcon}>
              <Ionicons
                name={isPremium ? 'star' : 'star-outline'}
                size={24}
                color={isPremium ? Theme.colors.premium : Theme.colors.inactive}
              />
            </View>
            <View style={styles.subscriptionInfo}>
              <Text style={styles.subscriptionTitle}>NutriAI {isPremium ? 'Premium' : 'Free'}</Text>
              <Text style={styles.subscriptionPlan}>{getTierLabel()}</Text>
            </View>
            <TouchableOpacity style={styles.subscriptionAction} onPress={handleManageSubscription}>
              <Text style={styles.subscriptionActionText}>{isPremium ? 'Manage' : 'Upgrade'}</Text>
            </TouchableOpacity>
          </View>

          {isPremium && (
            <View style={styles.subscriptionDetails}>
              <View style={styles.subscriptionDetailRow}>
                <Text style={styles.subscriptionDetailLabel}>Status</Text>
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>Active</Text>
                </View>
              </View>
              <View style={styles.dividerFull} />
              <TouchableOpacity
                style={styles.subscriptionDetailRow}
                onPress={handleCancelSubscription}
              >
                <Text style={[styles.subscriptionDetailLabel, { color: Theme.colors.error }]}>
                  Cancel Subscription
                </Text>
                <Ionicons name="chevron-forward" size={16} color={Theme.colors.error} />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestorePurchases}
            disabled={isRestoring}
          >
            {isRestoring ? (
              <View style={styles.restoreLoading}>
                <View style={styles.restoreDot} />
                <View style={styles.restoreDot} />
                <View style={styles.restoreDot} />
              </View>
            ) : (
              <Text style={styles.restoreText}>Restore Purchases</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NUTRITION</Text>
          <View style={styles.sectionCard}>
            <SettingRow
              icon="nutrition-outline"
              title="Daily Goals"
              subtitle="Calories, protein, carbs, fat targets"
              onPress={() => {
                Alert.alert('Daily Goals', 'Configure your daily calorie and macro targets.');
              }}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="scale-outline"
              title="Units"
              subtitle="Metric (grams, kg)"
              onPress={() => {
                Alert.alert('Units', 'Unit preferences will be available in a future update.');
              }}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="body-outline"
              title="Dietary Preferences"
              subtitle="Update your diet type"
              onPress={() => {
                Alert.alert(
                  'Dietary Preferences',
                  'You can update your dietary preferences in the profile section.',
                );
              }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PREFERENCES</Text>
          <View style={styles.sectionCard}>
            <SettingRow
              icon="notifications-outline"
              title="Meal Reminders"
              trailing={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={val => {
                    haptics.medium();
                    setNotificationsEnabled(val);
                  }}
                  trackColor={{
                    false: Theme.colors.disabled,
                    true: Theme.colors.primaryLight,
                  }}
                  thumbColor={notificationsEnabled ? Theme.colors.primary : Theme.colors.inactive}
                />
              }
            />
            <View style={styles.divider} />
            <SettingRow
              icon="fitness-outline"
              title="Apple Health Sync"
              trailing={
                <Switch
                  value={healthSyncEnabled}
                  onValueChange={val => {
                    haptics.medium();
                    setHealthSyncEnabled(val);
                  }}
                  trackColor={{
                    false: Theme.colors.disabled,
                    true: Theme.colors.primaryLight,
                  }}
                  thumbColor={healthSyncEnabled ? Theme.colors.primary : Theme.colors.inactive}
                />
              }
            />
            <View style={styles.divider} />
            <SettingRow
              icon="moon-outline"
              title="Dark Mode"
              trailing={
                <View style={styles.enabledBadge}>
                  <Text style={styles.enabledBadgeText}>Always On</Text>
                </View>
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SUPPORT</Text>
          <View style={styles.sectionCard}>
            <SettingRow
              icon="help-circle-outline"
              title="Help Center"
              onPress={() => {
                Alert.alert('Help Center', 'Visit our website for FAQs and support articles.');
              }}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="chatbubble-outline"
              title="Contact Support"
              onPress={() => {
                Linking.openURL('mailto:support@nutriai.app');
              }}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="star-outline"
              title="Rate NutriAI"
              onPress={() => {
                Alert.alert('Thank You!', 'Your feedback helps us improve.');
              }}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="share-outline"
              title="Share NutriAI"
              onPress={() => {
                Alert.alert('Share', 'Share link will be provided in a future update.');
              }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>LEGAL</Text>
          <View style={styles.sectionCard}>
            <SettingRow
              icon="document-text-outline"
              title="Privacy Policy"
              onPress={() => {
                Linking.openURL('https://printmaxx.com/privacy');
              }}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="shield-checkmark-outline"
              title="Terms of Service"
              onPress={() => {
                Linking.openURL('https://printmaxx.com/tos');
              }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <SettingRow
              icon="information-circle-outline"
              title="App Version"
              trailing={<Text style={styles.versionText}>1.0.0 (1)</Text>}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            haptics.medium();
            Alert.alert('Log Out', 'Are you sure you want to log out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Log Out', style: 'destructive' },
            ]);
          }}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.madeWithLove}>Made with care for your health</Text>

        <View style={styles.bottomSpacer} />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    ...Theme.shadow.small,
  },

  subscriptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    ...Theme.shadow.small,
  },
  subscriptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  subscriptionPlan: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  subscriptionAction: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.border.radius.round,
    minHeight: 44,
    justifyContent: 'center',
  },
  subscriptionActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  subscriptionDetails: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
    marginTop: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    ...Theme.shadow.small,
  },
  subscriptionDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  subscriptionDetailLabel: {
    fontSize: 15,
    color: Theme.colors.text,
  },
  activeBadge: {
    backgroundColor: 'rgba(46, 213, 115, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: Theme.colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  dividerFull: {
    height: 1,
    backgroundColor: Theme.colors.border,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 14,
    minHeight: 44,
    justifyContent: 'center',
  },
  restoreText: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  restoreLoading: {
    flexDirection: 'row',
    gap: 4,
  },
  restoreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.colors.primary,
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: Theme.colors.text,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginLeft: 66,
  },
  versionText: {
    fontSize: 14,
    color: Theme.colors.inactive,
  },
  enabledBadge: {
    backgroundColor: Theme.colors.highlight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  enabledBadgeText: {
    color: Theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },

  logoutButton: {
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    minHeight: 52,
  },
  logoutText: {
    color: Theme.colors.error,
    fontSize: 16,
    fontWeight: '600',
  },

  madeWithLove: {
    textAlign: 'center',
    fontSize: 13,
    color: Theme.colors.inactive,
    marginTop: 24,
  },

  bottomSpacer: {
    height: 40,
  },
});

export default SettingsScreen;
