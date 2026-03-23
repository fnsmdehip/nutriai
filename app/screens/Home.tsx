import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';

import { Theme } from '../utils/theme';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addBonusScan } from '../store/subscriptionSlice';
import { showRewardedAd, isRewardedReady } from '../services/ads';
import BannerAdView from '../components/ads/BannerAdView';

const HomeScreen = () => {
  const [isToday, setIsToday] = useState(true);
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const dispatch = useAppDispatch();

  const isPremium = useAppSelector((state) => state.subscription.isPremium);
  const dailyScansUsed = useAppSelector((state) => state.subscription.dailyScansUsed);
  const dailyScanLimit = useAppSelector((state) => state.subscription.dailyScanLimit);
  const dailyGoal = useAppSelector((state) => state.nutrition.dailyGoal);
  const consumedItems = useAppSelector((state) => state.nutrition.consumedItems);
  const activeDate = useAppSelector((state) => state.nutrition.activeDate);

  const todayItems = consumedItems[activeDate] ?? [];
  const consumedCalories = todayItems.reduce((sum, item) => sum + item.calories, 0);
  const consumedProtein = todayItems.reduce((sum, item) => sum + item.protein, 0);
  const consumedCarbs = todayItems.reduce((sum, item) => sum + item.carbs, 0);
  const consumedFat = todayItems.reduce((sum, item) => sum + item.fat, 0);

  const caloriesLeft = Math.max(0, dailyGoal.calories - consumedCalories);
  const proteinLeft = Math.max(0, dailyGoal.protein - consumedProtein);
  const carbsLeft = Math.max(0, dailyGoal.carbs - consumedCarbs);
  const fatLeft = Math.max(0, dailyGoal.fat - consumedFat);

  const scansRemaining = isPremium
    ? Infinity
    : Math.max(0, dailyScanLimit - dailyScansUsed);

  const openCamera = useCallback(() => {
    if (!isPremium && scansRemaining <= 0) {
      Alert.alert(
        'Daily Scan Limit Reached',
        'You have used all 3 free AI scans for today. Upgrade to Premium for unlimited scans, or watch an ad for a bonus scan.',
        [
          { text: 'Upgrade', onPress: () => navigation.navigate('Paywall') },
          {
            text: 'Watch Ad',
            onPress: async () => {
              if (isRewardedReady()) {
                const earned = await showRewardedAd();
                if (earned) {
                  dispatch(addBonusScan());
                  navigation.navigate('Camera');
                }
              } else {
                Alert.alert('Ad Not Ready', 'Please try again in a moment.');
              }
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }
    navigation.navigate('Camera');
  }, [isPremium, scansRemaining, navigation, dispatch]);

  const getMacroColor = (nutrient: 'protein' | 'carbs' | 'fat'): string => {
    const colorMap = {
      protein: Theme.colors.protein,
      carbs: Theme.colors.carbs,
      fat: Theme.colors.fat,
    };
    return colorMap[nutrient];
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.tabButton, isToday ? styles.activeTab : null]}
          onPress={() => setIsToday(true)}
        >
          <Text style={isToday ? styles.activeTabText : styles.tabText}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, !isToday ? styles.activeTab : null]}
          onPress={() => setIsToday(false)}
        >
          <Text style={!isToday ? styles.activeTabText : styles.tabText}>Yesterday</Text>
        </TouchableOpacity>

        {/* Scan counter for free users */}
        {!isPremium && (
          <View style={styles.scanCounter}>
            <Ionicons name="camera-outline" size={14} color={Theme.colors.textSecondary} />
            <Text style={styles.scanCountText}>
              {scansRemaining === Infinity ? '--' : scansRemaining}/{dailyScanLimit}
            </Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.calorieContainer}>
          <Text style={styles.calorieCount}>{caloriesLeft}</Text>
          <Text style={styles.calorieLabel}>Calories left</Text>
        </View>

        <View style={styles.macroContainer}>
          {[
            { label: 'Protein', value: `${Math.round(proteinLeft)}g`, color: getMacroColor('protein') },
            { label: 'Carbs', value: `${Math.round(carbsLeft)}g`, color: getMacroColor('carbs') },
            { label: 'Fat', value: `${Math.round(fatLeft)}g`, color: getMacroColor('fat') },
          ].map((macro) => (
            <View key={macro.label} style={styles.macroItem}>
              <View style={[styles.macroCircle, { borderColor: macro.color }]}>
                <Text style={styles.macroValue}>{macro.value}</Text>
              </View>
              <Text style={styles.macroLabel}>{macro.label}</Text>
            </View>
          ))}
        </View>

        {/* Recently eaten */}
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recently eaten</Text>
          {todayItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={48} color={Theme.colors.disabled} />
              <Text style={styles.emptyStateText}>No food logged yet today</Text>
              <Text style={styles.emptyStateSubtext}>Tap the + button to scan your food</Text>
            </View>
          ) : (
            todayItems.map((item) => (
              <View key={item.id} style={styles.foodItem}>
                <View style={styles.foodImagePlaceholder}>
                  <Ionicons name="restaurant" size={20} color={Theme.colors.primary} />
                </View>
                <View style={styles.foodDetails}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.foodMacros}>
                    {item.calories} cal | P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Banner Ad - only for free users */}
      <BannerAdView containerStyle={styles.bannerAdContainer} />

      <TouchableOpacity style={styles.floatingButton} onPress={openCamera}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
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
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: Theme.colors.cardBackground,
  },
  tabText: {
    color: Theme.colors.inactive,
    fontSize: Theme.typography.fontSize.sm,
  },
  activeTabText: {
    color: Theme.colors.text,
    fontWeight: 'bold',
    fontSize: Theme.typography.fontSize.sm,
  },
  scanCounter: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.cardBackground,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scanCountText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginLeft: 4,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  calorieContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  calorieCount: {
    fontSize: 60,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  calorieLabel: {
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.textSecondary,
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  macroLabel: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
  recentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 15,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textSecondary,
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.inactive,
    marginTop: 4,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
    padding: 12,
    marginBottom: 10,
    ...Theme.shadow.small,
  },
  foodImagePlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  foodDetails: {
    flex: 1,
  },
  foodName: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  foodMacros: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  bannerAdContainer: {
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 80, // above the banner ad area
    right: 20,
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
