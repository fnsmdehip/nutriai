import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { HomeStackParamList } from '../../navigation/MainNavigator';
import { Theme } from '../../utils/theme';
import FloatingActionButton from '../../components/common/FloatingActionButton';
import MacroProgressCircle from '../../components/nutrition/MacroProgressCircle';
import FoodListItem from '../../components/nutrition/FoodListItem';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch();
  const [viewingToday, setViewingToday] = useState(true);
  
  const { foods, goals, isProcessingPhoto, calorieRollover } = useSelector(
    (state: RootState) => state.nutrition
  );
  const { isInTrial, isSubscribed } = useSelector(
    (state: RootState) => state.subscription
  );
  
  // Calculate nutrition values
  const foodsToShow = viewingToday ? foods.today : foods.yesterday;
  
  const consumedCalories = foodsToShow.reduce(
    (total, food) => total + food.calories, 0
  );
  
  const consumedMacros = foodsToShow.reduce(
    (macros, food) => {
      return {
        protein: macros.protein + food.protein,
        carbs: macros.carbs + food.carbs,
        fat: macros.fat + food.fat,
      };
    },
    { protein: 0, carbs: 0, fat: 0 }
  );
  
  // Calculate remaining values
  const totalCalorieGoal = goals.calories + (viewingToday ? calorieRollover : 0);
  const remainingCalories = Math.max(0, totalCalorieGoal - consumedCalories);
  const remainingProtein = Math.max(0, goals.protein - consumedMacros.protein);
  const remainingCarbs = Math.max(0, goals.carbs - consumedMacros.carbs);
  const remainingFat = Math.max(0, goals.fat - consumedMacros.fat);
  
  // Calculate progress percentages
  const calorieProgress = Math.min(100, (consumedCalories / totalCalorieGoal) * 100);
  const proteinProgress = Math.min(100, (consumedMacros.protein / goals.protein) * 100);
  const carbsProgress = Math.min(100, (consumedMacros.carbs / goals.carbs) * 100);
  const fatProgress = Math.min(100, (consumedMacros.fat / goals.fat) * 100);
  
  const handleAddFood = () => {
    navigation.navigate('AddFood');
  };
  
  const handleOpenCamera = () => {
    // If not subscribed or in trial, show trial offer
    if (!isSubscribed && !isInTrial) {
      navigation.navigate('TrialOffer');
    } else {
      navigation.navigate('Camera');
    }
  };
  
  const handleToggleDay = () => {
    setViewingToday(!viewingToday);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Today/Yesterday Toggle */}
      <View style={styles.header}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, viewingToday && styles.toggleButtonActive]}
            onPress={() => setViewingToday(true)}
          >
            <Text
              style={[styles.toggleText, viewingToday && styles.toggleTextActive]}
            >
              Today
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.toggleButton, !viewingToday && styles.toggleButtonActive]}
            onPress={() => setViewingToday(false)}
          >
            <Text
              style={[styles.toggleText, !viewingToday && styles.toggleTextActive]}
            >
              Yesterday
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Calories Remaining */}
        <View style={styles.calorieCard}>
          <MacroProgressCircle
            percentage={calorieProgress}
            color={Theme.colors.primary}
            size={160}
            strokeWidth={12}
          >
            <Text style={styles.calorieNumber}>{remainingCalories}</Text>
            <Text style={styles.calorieLabel}>Calories left</Text>
            
            {calorieRollover > 0 && viewingToday && (
              <View style={styles.rolloverContainer}>
                <Text style={styles.rolloverText}>+{calorieRollover} from yesterday</Text>
              </View>
            )}
          </MacroProgressCircle>
        </View>
        
        {/* Macros Remaining */}
        <View style={styles.macroContainer}>
          <View style={styles.macroCard}>
            <Text style={styles.macroTitle}>Protein</Text>
            <Text style={[styles.macroValue, { color: Theme.colors.protein }]}>
              {Math.round(remainingProtein)}g
            </Text>
            <View style={styles.macroProgressContainer}>
              <View
                style={[
                  styles.macroProgress,
                  { backgroundColor: Theme.colors.protein, width: `${proteinProgress}%` },
                ]}
              />
            </View>
          </View>
          
          <View style={styles.macroCard}>
            <Text style={styles.macroTitle}>Carbs</Text>
            <Text style={[styles.macroValue, { color: Theme.colors.carbs }]}>
              {Math.round(remainingCarbs)}g
            </Text>
            <View style={styles.macroProgressContainer}>
              <View
                style={[
                  styles.macroProgress,
                  { backgroundColor: Theme.colors.carbs, width: `${carbsProgress}%` },
                ]}
              />
            </View>
          </View>
          
          <View style={styles.macroCard}>
            <Text style={styles.macroTitle}>Fat</Text>
            <Text style={[styles.macroValue, { color: Theme.colors.fat }]}>
              {Math.round(remainingFat)}g
            </Text>
            <View style={styles.macroProgressContainer}>
              <View
                style={[
                  styles.macroProgress,
                  { backgroundColor: Theme.colors.fat, width: `${fatProgress}%` },
                ]}
              />
            </View>
          </View>
        </View>
        
        {/* Food List */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {viewingToday ? "Today's Food" : "Yesterday's Food"}
          </Text>
          
          {foodsToShow.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No food entries yet for {viewingToday ? 'today' : 'yesterday'}.
              </Text>
            </View>
          ) : (
            <View style={styles.foodList}>
              {foodsToShow.map((food) => (
                <FoodListItem
                  key={food.id}
                  food={food}
                  onPress={() => navigation.navigate('FoodDetails', { foodId: food.id })}
                />
              ))}
            </View>
          )}
        </View>
        
        {/* Processing Photo */}
        {isProcessingPhoto && (
          <View style={styles.processingContainer}>
            <Text style={styles.processingTitle}>Finalizing results...</Text>
            <Text style={styles.processingSubtitle}>We'll notify you when done!</Text>
          </View>
        )}
      </ScrollView>
      
      {/* Add Food FAB */}
      <FloatingActionButton
        onPress={handleAddFood}
        onLongPress={handleOpenCamera}
        style={styles.fab}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    paddingHorizontal: Theme.spacing.l,
    paddingVertical: Theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.large,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: Theme.spacing.xs,
    alignItems: 'center',
    borderRadius: Theme.border.radius.medium,
  },
  toggleButtonActive: {
    backgroundColor: Theme.colors.background,
    ...Theme.shadow.small,
  },
  toggleText: {
    fontSize: Theme.typography.fontSize.medium,
    color: Theme.colors.textSecondary,
  },
  toggleTextActive: {
    color: Theme.colors.text,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Theme.spacing.l,
    paddingBottom: Theme.spacing.xxl + 60, // Extra space for FAB
  },
  calorieCard: {
    alignItems: 'center',
    marginVertical: Theme.spacing.l,
  },
  calorieNumber: {
    fontSize: 42,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  calorieLabel: {
    fontSize: Theme.typography.fontSize.medium,
    color: Theme.colors.textSecondary,
  },
  rolloverContainer: {
    marginTop: Theme.spacing.xs,
  },
  rolloverText: {
    fontSize: Theme.typography.fontSize.small,
    color: Theme.colors.primary,
    fontWeight: '500',
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.l,
  },
  macroCard: {
    flex: 1,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
    padding: Theme.spacing.m,
    marginHorizontal: Theme.spacing.xs,
  },
  macroTitle: {
    fontSize: Theme.typography.fontSize.small,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  macroValue: {
    fontSize: Theme.typography.fontSize.large,
    fontWeight: '600',
    marginBottom: Theme.spacing.s,
  },
  macroProgressContainer: {
    height: 4,
    backgroundColor: Theme.colors.card,
    borderRadius: 2,
  },
  macroProgress: {
    height: 4,
    borderRadius: 2,
  },
  sectionContainer: {
    marginTop: Theme.spacing.l,
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSize.large,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.m,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xl,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
  },
  emptyText: {
    fontSize: Theme.typography.fontSize.medium,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  foodList: {
    marginBottom: Theme.spacing.l,
  },
  processingContainer: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
    padding: Theme.spacing.l,
    marginTop: Theme.spacing.l,
    alignItems: 'center',
  },
  processingTitle: {
    fontSize: Theme.typography.fontSize.large,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.s,
  },
  processingSubtitle: {
    fontSize: Theme.typography.fontSize.medium,
    color: Theme.colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: Theme.spacing.l,
    right: Theme.spacing.l,
  },
});

export default HomeScreen; 