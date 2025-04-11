import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Theme } from '../../utils/theme';
import { FoodItem } from '../../store/nutritionSlice';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AnalyticsScreen = () => {
  const [activeTab, setActiveTab] = useState<'week' | 'month' | 'insights'>('week');
  const [weeklyData, setWeeklyData] = useState<{ day: string; calories: number; protein: number; carbs: number; fat: number }[]>([]);
  const [averages, setAverages] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  
  const { foods, goals } = useSelector((state: RootState) => state.nutrition);
  
  // Generate demo data for analytics
  useEffect(() => {
    // In a real app, this would fetch data from an API or local database
    generateDemoData();
  }, []);
  
  const generateDemoData = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    
    const weekData = [];
    
    // Generate data for past 7 days
    for (let i = 6; i >= 0; i--) {
      const dayIndex = (dayOfWeek - i + 7) % 7;
      const dayName = DAYS_OF_WEEK[dayIndex];
      
      // Random data with a tendency to be near the goals
      const randomFactor = 0.7 + Math.random() * 0.6; // Between 0.7 and 1.3
      
      weekData.push({
        day: dayName,
        calories: Math.round(goals.calories * randomFactor),
        protein: Math.round(goals.protein * randomFactor),
        carbs: Math.round(goals.carbs * randomFactor),
        fat: Math.round(goals.fat * randomFactor),
      });
    }
    
    // Calculate averages
    const avgCalories = Math.round(
      weekData.reduce((sum, day) => sum + day.calories, 0) / 7
    );
    const avgProtein = Math.round(
      weekData.reduce((sum, day) => sum + day.protein, 0) / 7
    );
    const avgCarbs = Math.round(
      weekData.reduce((sum, day) => sum + day.carbs, 0) / 7
    );
    const avgFat = Math.round(
      weekData.reduce((sum, day) => sum + day.fat, 0) / 7
    );
    
    setWeeklyData(weekData);
    setAverages({ calories: avgCalories, protein: avgProtein, carbs: avgCarbs, fat: avgFat });
  };
  
  // Find max value in weekly data for normalizing chart heights
  const maxCalories = Math.max(...weeklyData.map(day => day.calories));
  
  // Insights based on data
  const generateInsights = () => {
    const insights = [
      {
        title: 'Calorie Balance',
        description: averages.calories > goals.calories 
          ? 'You\'re consistently over your calorie goal. Try focusing on lower calorie foods.'
          : 'Great job maintaining your calorie goals!'
      },
      {
        title: 'Protein Intake',
        description: averages.protein < goals.protein * 0.8
          ? 'Your protein intake is below target. Consider adding more lean protein to your diet.'
          : 'You\'re meeting your protein goals, which helps maintain muscle mass!'
      },
      {
        title: 'Consistency',
        description: 'You\'ve tracked your food for 7 days in a row. Keep up the great work!'
      }
    ];
    
    return insights;
  };
  
  const insights = generateInsights();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'week' && styles.activeTab]}
          onPress={() => setActiveTab('week')}
        >
          <Text
            style={[styles.tabText, activeTab === 'week' && styles.activeTabText]}
          >
            Week
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'month' && styles.activeTab]}
          onPress={() => setActiveTab('month')}
        >
          <Text
            style={[styles.tabText, activeTab === 'month' && styles.activeTabText]}
          >
            Month
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'insights' && styles.activeTab]}
          onPress={() => setActiveTab('insights')}
        >
          <Text
            style={[styles.tabText, activeTab === 'insights' && styles.activeTabText]}
          >
            Insights
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.contentContainer}>
        {activeTab === 'week' && (
          <View>
            {/* Weekly Summary */}
            <View style={styles.summaryContainer}>
              <Text style={styles.sectionTitle}>Weekly Summary</Text>
              
              <View style={styles.macroSummary}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{averages.calories}</Text>
                  <Text style={styles.macroLabel}>avg. calories</Text>
                </View>
                
                <View style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: Theme.colors.protein }]}>
                    {averages.protein}g
                  </Text>
                  <Text style={styles.macroLabel}>avg. protein</Text>
                </View>
                
                <View style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: Theme.colors.carbs }]}>
                    {averages.carbs}g
                  </Text>
                  <Text style={styles.macroLabel}>avg. carbs</Text>
                </View>
                
                <View style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: Theme.colors.fat }]}>
                    {averages.fat}g
                  </Text>
                  <Text style={styles.macroLabel}>avg. fat</Text>
                </View>
              </View>
            </View>
            
            {/* Calorie Chart */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Weekly Calories</Text>
              
              <View style={styles.chartContent}>
                {weeklyData.map((data, index) => (
                  <View key={index} style={styles.chartBarContainer}>
                    <View style={styles.chartLabelContainer}>
                      <Text style={styles.chartDayLabel}>{data.day}</Text>
                    </View>
                    
                    <View style={styles.barContainer}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: `${(data.calories / maxCalories) * 100}%`,
                            backgroundColor:
                              data.calories > goals.calories
                                ? Theme.colors.error
                                : Theme.colors.primary,
                          },
                        ]}
                      />
                    </View>
                    
                    <Text style={styles.chartValueLabel}>{data.calories}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.goalLine}>
                <View style={styles.goalLineBar} />
                <Text style={styles.goalLineLabel}>Goal: {goals.calories} cal</Text>
              </View>
            </View>
          </View>
        )}
        
        {activeTab === 'month' && (
          <View style={styles.comingSoonContainer}>
            <Text style={styles.comingSoonText}>Monthly analytics coming soon!</Text>
          </View>
        )}
        
        {activeTab === 'insights' && (
          <View style={styles.insightsContainer}>
            <Text style={styles.sectionTitle}>Personalized Insights</Text>
            
            {insights.map((insight, index) => (
              <View key={index} style={styles.insightCard}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightDescription}>{insight.description}</Text>
              </View>
            ))}
          </View>
        )}
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  tab: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    marginRight: Theme.spacing.md,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Theme.colors.primary,
  },
  tabText: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textSecondary,
  },
  activeTabText: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    padding: Theme.spacing.lg,
  },
  summaryContainer: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  macroSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  macroItem: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
    padding: Theme.spacing.md,
    minWidth: '45%',
    marginBottom: Theme.spacing.sm,
    ...Theme.shadow.small,
  },
  macroValue: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.xs,
  },
  macroLabel: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
  chartContainer: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadow.small,
  },
  chartTitle: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  chartContent: {
    flexDirection: 'row',
    height: 200,
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
  },
  chartLabelContainer: {
    position: 'absolute',
    bottom: -20,
    width: '100%',
    alignItems: 'center',
  },
  chartDayLabel: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
  barContainer: {
    height: '100%',
    width: 20,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  chartValueLabel: {
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginTop: 5,
    position: 'absolute',
    bottom: -40,
  },
  goalLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.md,
  },
  goalLineBar: {
    height: 2,
    width: 20,
    backgroundColor: Theme.colors.border,
    marginRight: Theme.spacing.xs,
  },
  goalLineLabel: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Theme.spacing.xxl,
  },
  comingSoonText: {
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.textSecondary,
  },
  insightsContainer: {
    marginBottom: Theme.spacing.lg,
  },
  insightCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.small,
  },
  insightTitle: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  insightDescription: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textSecondary,
  },
});

export default AnalyticsScreen; 