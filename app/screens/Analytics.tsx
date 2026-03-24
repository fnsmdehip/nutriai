import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { LineChart, PieChart } from 'react-native-chart-kit';

import { Theme } from '../utils/theme';
import { useAppSelector } from '../store/hooks';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 48;

type TimeRange = 'week' | 'month';

function getLastNDaysLabels(n: number): string[] {
  const labels: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
  }
  return labels;
}

function daysAgoISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

const AnalyticsScreen = (): React.JSX.Element => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const isPremium = useAppSelector((state) => state.subscription.isPremium);
  const consumedItems = useAppSelector((state) => state.nutrition.consumedItems);
  const dailyGoal = useAppSelector((state) => state.nutrition.dailyGoal);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  const days = timeRange === 'week' ? 7 : 30;

  // Calorie data for the selected range
  const calorieData = useMemo(() => {
    const labels = timeRange === 'week'
      ? getLastNDaysLabels(7)
      : getLastNDaysLabels(30).filter((_, i) => i % 5 === 0 || i === 29);

    const data: number[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const dateKey = daysAgoISO(i);
      const items = consumedItems[dateKey] ?? [];
      const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);
      data.push(totalCalories);
    }

    const displayData = timeRange === 'month'
      ? data.filter((_, i) => i % 5 === 0 || i === data.length - 1)
      : data;

    return { labels, data: displayData };
  }, [consumedItems, timeRange, days]);

  // Macro breakdown
  const macroData = useMemo(() => {
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    for (let i = days - 1; i >= 0; i--) {
      const dateKey = daysAgoISO(i);
      const items = consumedItems[dateKey] ?? [];
      items.forEach((item) => {
        totalProtein += item.protein;
        totalCarbs += item.carbs;
        totalFat += item.fat;
      });
    }

    const total = totalProtein + totalCarbs + totalFat;
    if (total === 0) {
      return {
        protein: dailyGoal.protein,
        carbs: dailyGoal.carbs,
        fat: dailyGoal.fat,
        hasData: false,
      };
    }

    return { protein: totalProtein, carbs: totalCarbs, fat: totalFat, hasData: true };
  }, [consumedItems, dailyGoal, days]);

  // Streak
  const streak = useMemo(() => {
    let count = 0;
    for (let i = 0; i < 365; i++) {
      const dateKey = daysAgoISO(i);
      const items = consumedItems[dateKey] ?? [];
      if (items.length > 0) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [consumedItems]);

  // Summary stats
  const summary = useMemo(() => {
    const allData: number[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const dateKey = daysAgoISO(i);
      const items = consumedItems[dateKey] ?? [];
      allData.push(items.reduce((sum, item) => sum + item.calories, 0));
    }

    const total = allData.reduce((sum, cal) => sum + cal, 0);
    const daysLogged = allData.filter((cal) => cal > 0).length;
    const dailyAvg = daysLogged > 0 ? Math.round(total / daysLogged) : 0;
    const goalPercent = dailyGoal.calories > 0
      ? Math.round((dailyAvg / dailyGoal.calories) * 100)
      : 0;

    return { total, daysLogged, dailyAvg, goalPercent };
  }, [consumedItems, dailyGoal, days]);

  const pieChartData = [
    {
      name: 'Protein',
      value: Math.max(1, Math.round(macroData.protein)),
      color: Theme.colors.protein,
      legendFontColor: Theme.colors.textSecondary,
      legendFontSize: 13,
    },
    {
      name: 'Carbs',
      value: Math.max(1, Math.round(macroData.carbs)),
      color: Theme.colors.carbs,
      legendFontColor: Theme.colors.textSecondary,
      legendFontSize: 13,
    },
    {
      name: 'Fat',
      value: Math.max(1, Math.round(macroData.fat)),
      color: Theme.colors.fat,
      legendFontColor: Theme.colors.textSecondary,
      legendFontSize: 13,
    },
  ];

  const chartConfig = {
    backgroundColor: Theme.colors.surface,
    backgroundGradientFrom: Theme.colors.surface,
    backgroundGradientTo: Theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity: number = 1) => `rgba(46, 213, 115, ${opacity})`,
    labelColor: () => Theme.colors.textSecondary,
    style: {
      borderRadius: 12,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: Theme.colors.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: Theme.colors.border,
      strokeWidth: 1,
    },
  };

  const ensureChartData = (data: number[]): number[] => {
    if (data.length === 0) return [0];
    if (data.every((v) => v === 0)) return data.map(() => 0);
    return data;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        {!isPremium && (
          <TouchableOpacity
            style={styles.premiumBadge}
            onPress={() => navigation.navigate('Paywall')}
          >
            <Ionicons name="star" size={14} color={Theme.colors.premium} />
            <Text style={styles.premiumBadgeText}>PRO</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Time Range Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, timeRange === 'week' && styles.toggleActive]}
          onPress={() => setTimeRange('week')}
        >
          <Text style={[styles.toggleText, timeRange === 'week' && styles.toggleTextActive]}>
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            timeRange === 'month' && styles.toggleActive,
            !isPremium && styles.toggleLocked,
          ]}
          onPress={() => {
            if (isPremium) {
              setTimeRange('month');
            } else {
              navigation.navigate('Paywall');
            }
          }}
        >
          <Text style={[styles.toggleText, timeRange === 'month' && styles.toggleTextActive]}>
            Monthly
          </Text>
          {!isPremium && <Ionicons name="lock-closed" size={12} color={Theme.colors.inactive} />}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Calorie Trends Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calorie Trends</Text>
          <View style={styles.chartCard}>
            <LineChart
              data={{
                labels: calorieData.labels,
                datasets: [
                  {
                    data: ensureChartData(calorieData.data),
                    strokeWidth: 3,
                  },
                  {
                    data: Array(calorieData.data.length).fill(dailyGoal.calories) as number[],
                    strokeWidth: 1,
                    color: (opacity: number = 1) => `rgba(255, 107, 107, ${opacity * 0.4})`,
                    withDots: false,
                  },
                ],
              }}
              width={chartWidth}
              height={200}
              yAxisSuffix=""
              yAxisInterval={1}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              fromZero
            />
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Theme.colors.primary }]} />
                <Text style={styles.legendText}>Consumed</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Theme.colors.protein }]} />
                <Text style={styles.legendText}>Daily Goal</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Macro Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Macro Distribution</Text>
          <View style={styles.chartCard}>
            <PieChart
              data={pieChartData}
              width={chartWidth}
              height={180}
              chartConfig={chartConfig}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
            {!macroData.hasData && (
              <Text style={styles.chartNote}>Showing goal ratios (no data logged yet)</Text>
            )}
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="flame" size={24} color={Theme.colors.protein} />
              <Text style={styles.statValue}>{summary.dailyAvg.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Daily Avg</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color={Theme.colors.fat} />
              <Text style={styles.statValue}>{summary.daysLogged}</Text>
              <Text style={styles.statLabel}>Days Logged</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="trending-up" size={24} color={Theme.colors.carbs} />
              <Text style={styles.statValue}>{summary.goalPercent}%</Text>
              <Text style={styles.statLabel}>Goal Hit</Text>
            </View>
          </View>
        </View>

        {/* Streak */}
        <View style={styles.section}>
          <View style={styles.streakCard}>
            <View style={styles.streakIconContainer}>
              <Ionicons name="flame" size={40} color={Theme.colors.protein} />
            </View>
            <View style={styles.streakContent}>
              <Text style={styles.streakNumber}>{streak}</Text>
              <Text style={styles.streakLabel}>day logging streak</Text>
            </View>
          </View>
        </View>

        {/* Premium CTA for free users */}
        {!isPremium && (
          <TouchableOpacity
            style={styles.premiumCta}
            onPress={() => navigation.navigate('Paywall')}
            activeOpacity={0.85}
          >
            <Ionicons name="lock-open-outline" size={24} color={Theme.colors.premium} />
            <Text style={styles.premiumCtaTitle}>Unlock Full Analytics</Text>
            <Text style={styles.premiumCtaDesc}>
              Monthly trends, weight tracking, nutrient insights, and personalized recommendations
            </Text>
            <View style={styles.premiumCtaButton}>
              <Text style={styles.premiumCtaButtonText}>Go Premium</Text>
            </View>
          </TouchableOpacity>
        )}

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: Theme.typography.fontSize.xxl,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.border.radius.round,
    gap: 4,
  },
  premiumBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.premium,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: Theme.border.radius.small,
    gap: 4,
  },
  toggleActive: {
    backgroundColor: Theme.colors.primary,
  },
  toggleLocked: {
    opacity: 0.7,
  },
  toggleText: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 12,
  },
  chartCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
    padding: 12,
    ...Theme.shadow.small,
  },
  chart: {
    marginVertical: 4,
    borderRadius: 12,
  },
  chartNote: {
    fontSize: 12,
    color: Theme.colors.inactive,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
    padding: 16,
    alignItems: 'center',
    ...Theme.shadow.small,
  },
  statValue: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  streakCard: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.border.radius.medium,
    padding: 20,
    alignItems: 'center',
    ...Theme.shadow.small,
  },
  streakIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  streakContent: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  streakLabel: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
  premiumCta: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: Theme.colors.highlight,
    borderRadius: Theme.border.radius.medium,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  premiumCtaTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '700',
    color: Theme.colors.text,
    marginTop: 12,
  },
  premiumCtaDesc: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  premiumCtaButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: Theme.border.radius.large,
    marginTop: 16,
    ...Theme.shadow.medium,
  },
  premiumCtaButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: Theme.typography.fontSize.md,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default AnalyticsScreen;
