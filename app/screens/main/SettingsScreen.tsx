import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout, toggleMetricSystem } from '../../store/userSlice';
import { setRolloverEnabled, setMaxRollover } from '../../store/nutritionSlice';
import { Theme } from '../../utils/theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackParamList } from '../../navigation/MainNavigator';

type SettingsScreenNavigationProp = StackNavigationProp<SettingsStackParamList, 'Settings'>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const dispatch = useDispatch();
  const { metrics, healthConnected } = useSelector((state: RootState) => state.user);
  const { hasEnabledRollover, maxRollover } = useSelector((state: RootState) => state.nutrition);
  const { isSubscribed, isInTrial } = useSelector((state: RootState) => state.subscription);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => dispatch(logout()),
        style: 'destructive',
      },
    ]);
  };

  const handleToggleMetricSystem = () => {
    dispatch(toggleMetricSystem());
  };

  const handleToggleRollover = () => {
    dispatch(setRolloverEnabled(!hasEnabledRollover));
  };

  const generateSettingsList = () => {
    const settings = [
      {
        title: 'Account',
        items: [
          {
            label: 'Profile',
            type: 'link',
            premium: false,
            onPress: () => {},
          },
          {
            label: isSubscribed ? 'Manage Subscription' : 'Get Premium',
            type: 'link',
            premium: false,
            onPress: () => {},
            showChevron: true,
          },
        ],
      },
      {
        title: 'Preferences',
        items: [
          {
            label: 'Use Metric System',
            description: metrics.usesMetricSystem ? 'kg, cm' : 'lb, in',
            type: 'switch',
            value: metrics.usesMetricSystem,
            premium: false,
            onToggle: handleToggleMetricSystem,
          },
          {
            label: 'Enable Calorie Rollover',
            description: hasEnabledRollover ? 'On' : 'Off',
            type: 'switch',
            value: hasEnabledRollover,
            premium: true,
            onToggle: handleToggleRollover,
            disabled: !isSubscribed && !isInTrial,
          },
          {
            label: 'Start Week On',
            description: 'Monday',
            type: 'link',
            premium: false,
            onPress: () => {},
            showChevron: true,
          },
        ],
      },
      {
        title: 'Integrations',
        items: [
          {
            label: 'Connect Health App',
            description: healthConnected ? 'Connected' : 'Not Connected',
            type: 'link',
            premium: true,
            onPress: () => {},
            showChevron: true,
            disabled: !isSubscribed && !isInTrial,
          },
        ],
      },
      {
        title: 'Developer',
        items: [
          {
            label: 'API Test',
            description: 'Test Google AI API configuration',
            type: 'link',
            premium: false,
            onPress: () => navigation.navigate('ApiTest'),
            showChevron: true,
          },
        ],
      },
      {
        title: 'Support',
        items: [
          {
            label: 'Help Center',
            type: 'link',
            premium: false,
            onPress: () => {},
            showChevron: true,
          },
          {
            label: 'Contact Support',
            type: 'link',
            premium: false,
            onPress: () => {},
            showChevron: true,
          },
          {
            label: 'Privacy Policy',
            type: 'link',
            premium: false,
            onPress: () => {},
            showChevron: true,
          },
          {
            label: 'Terms of Service',
            type: 'link',
            premium: false,
            onPress: () => {},
            showChevron: true,
          },
        ],
      },
    ];

    return settings;
  };

  const settings = generateSettingsList();

  const renderSettingItem = (item: any, index: number, isLast: boolean) => {
    const isPremiumLocked = item.premium && !isSubscribed && !isInTrial;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.settingItem,
          !isLast && styles.settingItemBorder,
          item.disabled && styles.settingItemDisabled,
        ]}
        onPress={item.type === 'link' ? item.onPress : undefined}
        disabled={item.disabled}
      >
        <View style={styles.settingItemContent}>
          <View style={styles.settingLabelContainer}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            {isPremiumLocked && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>Premium</Text>
              </View>
            )}
            {item.description && <Text style={styles.settingDescription}>{item.description}</Text>}
          </View>

          {item.type === 'switch' && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: Theme.colors.border, true: Theme.colors.primary }}
              disabled={item.disabled}
            />
          )}

          {item.type === 'link' && item.showChevron && (
            <View style={styles.chevron}>
              <View style={styles.chevronLine1} />
              <View style={styles.chevronLine2} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {settings.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) =>
                renderSettingItem(item, itemIndex, itemIndex === section.items.length - 1),
              )}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  headerTitle: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
    marginHorizontal: Theme.spacing.lg,
    marginVertical: Theme.spacing.sm,
  },
  sectionContent: {
    backgroundColor: Theme.colors.card,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Theme.colors.border,
  },
  settingItem: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  settingItemDisabled: {
    opacity: 0.5,
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLabelContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
  premiumBadge: {
    backgroundColor: Theme.colors.premium,
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: Theme.border.radius.small,
    marginLeft: Theme.spacing.xs,
    alignSelf: 'flex-start',
  },
  premiumBadgeText: {
    fontSize: Theme.typography.fontSize.xs,
    color: '#000',
    fontWeight: '600',
  },
  chevron: {
    width: 8,
    height: 13,
    marginLeft: Theme.spacing.md,
    position: 'relative',
  },
  chevronLine1: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 7,
    width: 2,
    backgroundColor: Theme.colors.border,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  chevronLine2: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 7,
    width: 2,
    backgroundColor: Theme.colors.border,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
  },
  logoutButton: {
    marginHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
    alignItems: 'center',
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  logoutText: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.error,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xxl,
  },
  versionText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
});

export default SettingsScreen;
