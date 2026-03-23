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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';

import { Theme } from '../utils/theme';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setSubscriptionTier } from '../store/subscriptionSlice';
import { restorePurchases } from '../services/purchases';

const Settings = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const dispatch = useAppDispatch();

  const isPremium = useAppSelector((state) => state.subscription.isPremium);
  const tier = useAppSelector((state) => state.subscription.tier);

  const [isRestoring, setIsRestoring] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [healthSyncEnabled, setHealthSyncEnabled] = useState(true);

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

  const handleManageSubscription = () => {
    if (isPremium) {
      // Already premium - show management options
      Alert.alert(
        'Manage Subscription',
        'To manage or cancel your subscription, go to your device settings.',
        [
          { text: 'OK' },
        ]
      );
    } else {
      navigation.navigate('Paywall');
    }
  };

  const handleRestorePurchases = useCallback(async () => {
    try {
      setIsRestoring(true);
      const customerInfo = await restorePurchases();
      const hasPremium = customerInfo.entitlements.active['premium'] !== undefined;

      if (hasPremium) {
        dispatch(setSubscriptionTier('monthly')); // entitlement check will correct the tier
        Alert.alert('Restored!', 'Your premium subscription has been restored.');
      } else {
        Alert.alert('No Subscription Found', 'We could not find an active subscription to restore.');
      }
    } catch (error) {
      Alert.alert('Restore Failed', 'Something went wrong. Please try again later.');
      console.error('[Settings] Restore error:', error);
    } finally {
      setIsRestoring(false);
    }
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Subscription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>

          <View style={styles.premiumBanner}>
            <View style={styles.premiumIconContainer}>
              <Ionicons
                name="star"
                size={24}
                color={isPremium ? Theme.colors.premium : Theme.colors.inactive}
              />
            </View>
            <View style={styles.premiumTextContainer}>
              <Text style={styles.premiumTitle}>Nutri AI {isPremium ? 'Premium' : 'Free'}</Text>
              <Text style={styles.premiumSubtitle}>{getTierLabel()}</Text>
            </View>
            <TouchableOpacity style={styles.premiumButton} onPress={handleManageSubscription}>
              <Text style={styles.premiumButtonText}>
                {isPremium ? 'Manage' : 'Upgrade'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Restore Purchases */}
          <TouchableOpacity
            style={styles.restoreRow}
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

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="person-outline" size={22} color={Theme.colors.text} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Personal Information</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.inactive} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="lock-closed-outline" size={22} color={Theme.colors.text} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.inactive} />
          </TouchableOpacity>
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="notifications-outline" size={22} color={Theme.colors.text} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Theme.colors.disabled, true: Theme.colors.primaryLight }}
              thumbColor={notificationsEnabled ? Theme.colors.primary : Theme.colors.inactive}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="fitness-outline" size={22} color={Theme.colors.text} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Health App Sync</Text>
            </View>
            <Switch
              value={healthSyncEnabled}
              onValueChange={setHealthSyncEnabled}
              trackColor={{ false: Theme.colors.disabled, true: Theme.colors.primaryLight }}
              thumbColor={healthSyncEnabled ? Theme.colors.primary : Theme.colors.inactive}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="color-palette-outline" size={22} color={Theme.colors.text} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Appearance</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.inactive} />
          </TouchableOpacity>
        </View>

        {/* Help Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="help-circle-outline" size={22} color={Theme.colors.text} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>FAQ</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.inactive} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="mail-outline" size={22} color={Theme.colors.text} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Contact Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.inactive} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="document-text-outline" size={22} color={Theme.colors.text} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.inactive} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="document-outline" size={22} color={Theme.colors.text} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.inactive} />
          </TouchableOpacity>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="information-circle-outline" size={22} color={Theme.colors.text} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>App Version</Text>
            </View>
            <Text style={styles.versionText}>1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, styles.logoutItem]}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  headerTitle: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 15,
  },
  premiumBanner: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
    padding: 16,
    alignItems: 'center',
    ...Theme.shadow.small,
  },
  premiumIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  premiumSubtitle: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  premiumButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Theme.colors.primary,
    borderRadius: 16,
  },
  premiumButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: Theme.typography.fontSize.sm,
  },
  restoreRow: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  restoreText: {
    color: Theme.colors.primary,
    fontSize: Theme.typography.fontSize.sm,
    textDecorationLine: 'underline',
  },
  settingItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text,
  },
  versionText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.inactive,
  },
  logoutItem: {
    justifyContent: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: Theme.colors.error,
    fontSize: Theme.typography.fontSize.md,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Settings;
