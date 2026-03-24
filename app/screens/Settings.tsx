import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';

import { Theme } from '../utils/theme';
import { useAppSelector } from '../store/hooks';

const SettingsScreen = (): React.JSX.Element => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const isPremium = useAppSelector((state) => state.subscription.isPremium);
  const tier = useAppSelector((state) => state.subscription.tier);

  const [isRestoring, setIsRestoring] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [healthSyncEnabled, setHealthSyncEnabled] = useState(false);

  const getTierLabel = (): string => {
    switch (tier) {
      case 'monthly':
        return 'Monthly Plan';
      case 'yearly':
        return 'Yearly Plan';
      case 'lifetime':
        return 'Lifetime Plan';
      default:
        return 'Free Plan';
    }
  };

  const handleManageSubscription = (): void => {
    if (isPremium) {
      Alert.alert(
        'Manage Subscription',
        'To manage or cancel your subscription, go to your device Settings > Subscriptions.',
        [{ text: 'OK' }]
      );
    } else {
      navigation.navigate('Paywall');
    }
  };

  const handleRestorePurchases = useCallback(async (): Promise<void> => {
    try {
      setIsRestoring(true);

      // Simulate network call for restore
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1500);
      });

      // In production, call RevenueCat restorePurchases() here
      Alert.alert(
        'No Subscription Found',
        'We could not find an active subscription to restore. If you believe this is an error, please contact support.'
      );
    } catch {
      Alert.alert('Restore Failed', 'Something went wrong. Please try again later.');
    } finally {
      setIsRestoring(false);
    }
  }, []);

  const handleDailyGoalEdit = (): void => {
    Alert.alert(
      'Daily Goals',
      'Configure your daily calorie and macro targets in your profile settings.',
      [{ text: 'OK' }]
    );
  };

  type SettingRowProps = {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    trailing?: React.ReactNode;
  };

  const SettingRow = ({ icon, title, subtitle, onPress, trailing }: SettingRowProps): React.JSX.Element => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
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
      {trailing ?? (
        onPress ? <Ionicons name="chevron-forward" size={18} color={Theme.colors.inactive} /> : null
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Subscription Section */}
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
              <Text style={styles.subscriptionTitle}>
                NutriAI {isPremium ? 'Premium' : 'Free'}
              </Text>
              <Text style={styles.subscriptionPlan}>{getTierLabel()}</Text>
            </View>
            <TouchableOpacity style={styles.subscriptionAction} onPress={handleManageSubscription}>
              <Text style={styles.subscriptionActionText}>
                {isPremium ? 'Manage' : 'Upgrade'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestorePurchases}
            disabled={isRestoring}
          >
            {isRestoring ? (
              <ActivityIndicator size="small" color={Theme.colors.primary} />
            ) : (
              <Text style={styles.restoreText}>Restore Purchases</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Goals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NUTRITION</Text>
          <View style={styles.sectionCard}>
            <SettingRow
              icon="nutrition-outline"
              title="Daily Goals"
              subtitle="Calories, protein, carbs, fat targets"
              onPress={handleDailyGoalEdit}
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
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PREFERENCES</Text>
          <View style={styles.sectionCard}>
            <SettingRow
              icon="notifications-outline"
              title="Meal Reminders"
              trailing={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: Theme.colors.disabled, true: Theme.colors.primaryLight }}
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
                  onValueChange={setHealthSyncEnabled}
                  trackColor={{ false: Theme.colors.disabled, true: Theme.colors.primaryLight }}
                  thumbColor={healthSyncEnabled ? Theme.colors.primary : Theme.colors.inactive}
                />
              }
            />
          </View>
        </View>

        {/* Support Section */}
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
                Alert.alert('Contact Support', 'Email us at support@nutriai.app');
              }}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="document-text-outline"
              title="Privacy Policy"
              onPress={() => {
                Alert.alert('Privacy Policy', 'Opens in your browser.');
              }}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="shield-checkmark-outline"
              title="Terms of Service"
              onPress={() => {
                Alert.alert('Terms of Service', 'Opens in your browser.');
              }}
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <SettingRow
              icon="information-circle-outline"
              title="App Version"
              trailing={<Text style={styles.versionText}>1.0.0</Text>}
            />
          </View>
        </View>

        {/* Log Out */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

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
    fontSize: Theme.typography.fontSize.xxl,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 16,
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
    ...Theme.shadow.small,
  },

  // Subscription card
  subscriptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
    padding: 16,
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
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  subscriptionPlan: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  subscriptionAction: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.border.radius.round,
  },
  subscriptionActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: Theme.typography.fontSize.sm,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  restoreText: {
    color: Theme.colors.primary,
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '600',
  },

  // Setting rows
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
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
    fontSize: Theme.typography.fontSize.md,
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
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.inactive,
  },

  // Log out
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  logoutText: {
    color: Theme.colors.error,
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
  },

  bottomSpacer: {
    height: 40,
  },
});

export default SettingsScreen;
