import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';

import { Theme } from '../utils/theme';
import { useAppSelector } from '../store/hooks';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 48; // 24px padding each side

/** Generate date labels for the last N days. */
function getLastNDaysLabels(n: number): string[] {
  const labels: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
  }
  return labels;
}

/** Get ISO date string for N days ago. */
function daysAgoISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

const Analytics = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const isPremium = useAppSelector((state) => state.subscription.isPremium);
  const consumedItems = useAppSelector((state) => state.nutrition.consumedItems);
  const dailyGoal = useAppSelector((state) => state.nutrition.dailyGoal);

  // Compute weekly calorie data from Redux store
  const weeklyData = useMemo(() => {
    const labels = getLastNDaysLabels(7);
    const data: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const dateKey = daysAgoISO(i);
      const items = consumedItems[dateKey] ?? [];
      const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);
      data.push(totalCalories);
    }

    return { labels, data };
  }, [consumedItems]);

  // Compute macro breakdown for the current week
  const macroData = useMemo(() => {
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    for (let i = 6; i >= 0; i--) {
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
      // Show goal proportions when no data
      return {
        protein: dailyGoal.protein,
        carbs: dailyGoal.carbs,
        fat: dailyGoal.fat,
      };
    }

    return { protein: totalProtein, carbs: totalCarbs, fat: totalFat };
  }, [consumedItems, dailyGoal]);

  // Streak calculation
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

  // Weekly summary
  const weeklySummary = useMemo(() => {
    const weekTotal = weeklyData.data.reduce((sum, cal) => sum + cal, 0);
    const daysWithData = weeklyData.data.filter((cal) => cal > 0).length;
    const dailyAvg = daysWithData > 0 ? Math.round(weekTotal / daysWithData) : 0;
    const goalPercent = dailyGoal.calories > 0
      ? Math.round((dailyAvg / dailyGoal.calories) * 100)
      : 0;
    return { weekTotal, dailyAvg, goalPercent };
  }, [weeklyData, dailyGoal]);

  const handlePremiumGate = () => {
    if (!isPremium) {
      navigation.navigate('Paywall');
    }
  };

  // Pie chart data
  const pieData = [
    {
      name: 'Protein',
      value: Math.round(macroData.protein),
      color: Theme.colors.protein,
      legendFontColor: Theme.colors.text,
      legendFontSize: 13,
    },
    {
      name: 'Carbs',
      value: Math.round(macroData.carbs),
      color: Theme.colors.carbs,
      legendFontColor: Theme.colors.text,
      legendFontSize: 13,
    },
    {
      name: 'Fat',
      value: Math.round(macroData.fat),
      color: Theme.colors.fat,
      legendFontColor: Theme.colors.text,
      legendFontSize: 13,
    },
  ];

  const chartConfig = {
    backgroundColor: Theme.colors.card,
    backgroundGradientFrom: Theme.colors.card,
    backgroundGradientTo: Theme.colors.card,
    decimalPlaces: 0,
    color: (opacity: number = 1) => `rgba(93, 156, 89, ${opacity})`, // primary green
    labelColor: (opacity: number = 1) => `rgba(57, 57, 57, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: Theme.colors.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: Theme.colors.border,
      strokeWidth: 1,
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        {!isPremium && (
          <TouchableOpacity style={styles.premiumBadge} onPress={handlePremiumGate}>
            <Ionicons name="star" size={14} color={Theme.colors.shadow} />
            <Text style={styles.premiumBadgeText}>Premium</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Weekly Calorie Trends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calorie Trends</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: weeklyData.labels,
                datasets: [
                  {
                    data: weeklyData.data.every((v) => v === 0)
                      ? [0, 0, 0, 0, 0, 0, 0]
                      : weeklyData.data,
                    strokeWidth: 3,
                  },
                  {
                    // Goal line
                    data: Array(7).fill(dailyGoal.calories) as number[],
                    strokeWidth: 1,
                    color: (opacity: number = 1) => `rgba(214, 123, 86, ${opacity * 0.5})`,
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
                <Text style={styles.legendText}>Goal</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Macro Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Macro Distribution</Text>
          <View style={styles.chartContainer}>
            <PieChart
              data={pieData}
              width={chartWidth}
              height={180}
              chartConfig={chartConfig}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </View>

        {/* Streak & Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Ionicons name="flame-outline" size={24} color={Theme.colors.protein} />
              <Text style={styles.summaryValue}>
                {weeklySummary.dailyAvg.toLocaleString()}
              </Text>
              <Text style={styles.summaryLabel}>Daily Avg</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="calendar-outline" size={24} color={Theme.colors.primary} />
              <Text style={styles.summaryValue}>
                {weeklySummary.weekTotal.toLocaleString()}
              </Text>
              <Text style={styles.summaryLabel}>Week Total</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="trophy-outline" size={24} color={Theme.colors.warning} />
              <Text style={styles.summaryValue}>{weeklySummary.goalPercent}%</Text>
              <Text style={styles.summaryLabel}>Goal</Text>
            </View>
          </View>
        </View>

        {/* Streak */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logging Streak</Text>
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={48} color={Theme.colors.protein} />
            <Text style={styles.streakNumber}>{streak}</Text>
            <Text style={styles.streakLabel}>{streak === 1 ? 'day' : 'days'} in a row</Text>
          </View>
        </View>

        {/* Premium gate for monthly trends */}
        {!isPremium && (
          <TouchableOpacity style={styles.premiumCTA} onPress={handlePremiumGate}>
            <Ionicons name="lock-closed-outline" size={24} color={Theme.colors.shadow} />
            <Text style={styles.premiumCTATitle}>Unlock Monthly Trends</Text>
            <Text style={styles.premiumCTASubtitle}>
              Get detailed monthly analytics, weight tracking, and insights
            </Text>
            <View style={styles.premiumCTAButton}>
              <Text style={styles.premiumCTAButtonText}>Go Premium</Text>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  headerTitle: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.premium,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  premiumBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Theme.colors.shadow,
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
    padding: 12,
    ...Theme.shadow.small,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
    padding: 20,
    ...Theme.shadow.small,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginTop: 6,
  },
  summaryLabel: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  streakContainer: {
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
    padding: 24,
    ...Theme.shadow.small,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginTop: 8,
  },
  streakLabel: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  premiumCTA: {
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: Theme.colors.highlight,
    borderRadius: Theme.border.radius.large,
    padding: 24,
    alignItems: 'center',
    ...Theme.shadow.medium,
  },
  premiumCTATitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginTop: 8,
  },
  premiumCTASubtitle: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  premiumCTAButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginTop: 16,
  },
  premiumCTAButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: Theme.typography.fontSize.md,
  },
  bottomSpacer: {
    height: 32,
  },
});

export default Analytics;
