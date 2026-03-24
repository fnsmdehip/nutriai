import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';

import { Theme } from '../utils/theme';
import { useAppSelector } from '../store/hooks';

const HomeScreen = (): React.JSX.Element => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const isPremium = useAppSelector((state) => state.subscription.isPremium);
  const dailyScansUsed = useAppSelector((state) => state.subscription.dailyScansUsed);
  const dailyScanLimit = useAppSelector((state) => state.subscription.dailyScanLimit);
  const dailyGoal = useAppSelector((state) => state.nutrition.dailyGoal);
  const consumedItems = useAppSelector((state) => state.nutrition.consumedItems);
  const activeDate = useAppSelector((state) => state.nutrition.activeDate);

  const todayItems = consumedItems[activeDate] ?? [];

  const totals = useMemo(() => {
    const calories = todayItems.reduce((sum, item) => sum + item.calories, 0);
    const protein = todayItems.reduce((sum, item) => sum + item.protein, 0);
    const carbs = todayItems.reduce((sum, item) => sum + item.carbs, 0);
    const fat = todayItems.reduce((sum, item) => sum + item.fat, 0);
    return { calories, protein, carbs, fat };
  }, [todayItems]);

  const remaining = useMemo(() => ({
    calories: Math.max(0, dailyGoal.calories - totals.calories),
    protein: Math.max(0, dailyGoal.protein - totals.protein),
    carbs: Math.max(0, dailyGoal.carbs - totals.carbs),
    fat: Math.max(0, dailyGoal.fat - totals.fat),
  }), [dailyGoal, totals]);

  const scansRemaining = isPremium
    ? null
    : Math.max(0, dailyScanLimit - dailyScansUsed);

  const calorieProgress = dailyGoal.calories > 0
    ? Math.min(1, totals.calories / dailyGoal.calories)
    : 0;

  const getMacroProgress = (consumed: number, goal: number): number =>
    goal > 0 ? Math.min(1, consumed / goal) : 0;

  const openCamera = (): void => {
    navigation.navigate('Camera');
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    const m = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${h}:${m} ${ampm}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good {getTimeOfDay()}</Text>
          <Text style={styles.dateText}>{getFormattedDate()}</Text>
        </View>
        {!isPremium && scansRemaining !== null && (
          <View style={styles.scanBadge}>
            <Ionicons name="camera-outline" size={14} color={Theme.colors.primary} />
            <Text style={styles.scanBadgeText}>{scansRemaining} scans left</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Calorie Ring Card */}
        <View style={styles.calorieCard}>
          <View style={styles.calorieRingContainer}>
            <View style={styles.calorieRingOuter}>
              <View
                style={[
                  styles.calorieRingProgress,
                  {
                    borderColor: calorieProgress >= 1 ? Theme.colors.error : Theme.colors.primary,
                  },
                ]}
              />
              <View style={styles.calorieRingInner}>
                <Text style={styles.calorieNumber}>{remaining.calories}</Text>
                <Text style={styles.calorieUnit}>cal left</Text>
              </View>
            </View>
          </View>

          <View style={styles.calorieDetails}>
            <View style={styles.calorieDetailRow}>
              <Text style={styles.calorieDetailLabel}>Goal</Text>
              <Text style={styles.calorieDetailValue}>{dailyGoal.calories.toLocaleString()}</Text>
            </View>
            <View style={styles.calorieDetailRow}>
              <Text style={styles.calorieDetailLabel}>Consumed</Text>
              <Text style={styles.calorieDetailValue}>{totals.calories.toLocaleString()}</Text>
            </View>
            <View style={styles.calorieDetailRow}>
              <Text style={styles.calorieDetailLabel}>Remaining</Text>
              <Text style={[styles.calorieDetailValue, { color: Theme.colors.primary }]}>
                {remaining.calories.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Macro Progress Bars */}
        <View style={styles.macroCard}>
          <Text style={styles.sectionTitle}>Macros</Text>
          <View style={styles.macroGrid}>
            {([
              { label: 'Protein', consumed: totals.protein, goal: dailyGoal.protein, color: Theme.colors.protein, unit: 'g' },
              { label: 'Carbs', consumed: totals.carbs, goal: dailyGoal.carbs, color: Theme.colors.carbs, unit: 'g' },
              { label: 'Fat', consumed: totals.fat, goal: dailyGoal.fat, color: Theme.colors.fat, unit: 'g' },
            ] as const).map((macro) => (
              <View key={macro.label} style={styles.macroItem}>
                <View style={styles.macroHeader}>
                  <Text style={styles.macroLabel}>{macro.label}</Text>
                  <Text style={styles.macroValues}>
                    {Math.round(macro.consumed)}/{macro.goal}{macro.unit}
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${getMacroProgress(macro.consumed, macro.goal) * 100}%`,
                        backgroundColor: macro.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recently Logged Foods */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recently Logged</Text>
          {todayItems.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="restaurant-outline" size={32} color={Theme.colors.inactive} />
              </View>
              <Text style={styles.emptyTitle}>No food logged yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap the camera button to scan your first meal
              </Text>
            </View>
          ) : (
            todayItems.slice().reverse().map((item) => (
              <View key={item.id} style={styles.foodCard}>
                <View style={styles.foodIcon}>
                  <Ionicons name="restaurant" size={18} color={Theme.colors.primary} />
                </View>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.foodMeta}>
                    {item.calories} cal  {'\u00B7'}  P: {item.protein}g  {'\u00B7'}  C: {item.carbs}g  {'\u00B7'}  F: {item.fat}g
                  </Text>
                </View>
                <Text style={styles.foodTime}>{formatTime(item.timestamp)}</Text>
              </View>
            ))
          )}
        </View>

        {/* Bottom spacing for FAB */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={openCamera} activeOpacity={0.85}>
        <Ionicons name="camera" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: Theme.typography.fontSize.xxl,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  dateText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  scanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.border.radius.round,
  },
  scanBadgeText: {
    fontSize: 12,
    color: Theme.colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  calorieCard: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.surface,
    marginHorizontal: 20,
    borderRadius: Theme.border.radius.medium,
    padding: 20,
    ...Theme.shadow.small,
  },
  calorieRingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  calorieRingOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 6,
    borderColor: Theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calorieRingProgress: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 6,
  },
  calorieRingInner: {
    alignItems: 'center',
  },
  calorieNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  calorieUnit: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: -2,
  },
  calorieDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  calorieDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  calorieDetailLabel: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
  calorieDetailValue: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  macroCard: {
    backgroundColor: Theme.colors.surface,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: Theme.border.radius.medium,
    padding: 20,
    ...Theme.shadow.small,
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 16,
  },
  macroGrid: {
    gap: 14,
  },
  macroItem: {
    gap: 6,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  macroValues: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.border,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  recentSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  emptySubtitle: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  foodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
    padding: 14,
    marginBottom: 10,
    ...Theme.shadow.small,
  },
  foodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  foodMeta: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  foodTime: {
    fontSize: 12,
    color: Theme.colors.inactive,
  },
  bottomSpacer: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadow.large,
  },
});

export default HomeScreen;
