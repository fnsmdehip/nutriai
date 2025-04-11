import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { HomeStackParamList } from '../../navigation/MainNavigator';
import { FoodItem, removeFood, updateFood } from '../../store/nutritionSlice';
import { RootState } from '../../store';
import { Theme } from '../../utils/theme';
import Button from '../../components/common/Button';
import NutritionInfoCard from '../../components/nutrition/NutritionInfoCard';

type FoodDetailsScreenRouteProp = RouteProp<HomeStackParamList, 'FoodDetails'>;
type FoodDetailsScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'FoodDetails'>;

const FoodDetailsScreen = () => {
  const navigation = useNavigation<FoodDetailsScreenNavigationProp>();
  const route = useRoute<FoodDetailsScreenRouteProp>();
  const dispatch = useDispatch();
  const { foodId } = route.params;
  
  const allFoods = useSelector((state: RootState) => state.nutrition.foods);
  const [food, setFood] = useState<FoodItem | null>(null);
  
  useEffect(() => {
    // Find the food item in today's or yesterday's foods
    const foodFromToday = allFoods.today.find(f => f.id === foodId);
    const foodFromYesterday = allFoods.yesterday.find(f => f.id === foodId);
    
    if (foodFromToday) {
      setFood(foodFromToday);
    } else if (foodFromYesterday) {
      setFood(foodFromYesterday);
    } else {
      // Food not found - navigate back
      Alert.alert('Error', 'Food item not found');
      navigation.goBack();
    }
  }, [foodId, allFoods, navigation]);
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Food',
      `Are you sure you want to delete ${food?.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (food) {
              dispatch(removeFood(food.id));
              navigation.goBack();
            }
          },
        },
      ]
    );
  };
  
  const handleEdit = () => {
    navigation.navigate('AddFood');
    // In a real app, we would pass the food data to the AddFood screen for editing
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };
  
  if (!food) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
          >
            <View style={styles.backArrow}>
              <View style={styles.backArrowLine1} />
              <View style={styles.backArrowLine2} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEdit}
            hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.foodInfoSection}>
          <Text style={styles.foodName}>{food.name}</Text>
          <Text style={styles.timestamp}>{formatDate(food.timestamp)}</Text>
          <View style={styles.mealTypeContainer}>
            <Text style={styles.mealTypeText}>
              {food.mealType.charAt(0).toUpperCase() + food.mealType.slice(1)}
            </Text>
          </View>
        </View>
        
        <View style={styles.calorieContainer}>
          <Text style={styles.calorieValue}>{food.calories}</Text>
          <Text style={styles.calorieLabel}>calories</Text>
        </View>
        
        <NutritionInfoCard
          protein={food.protein}
          carbs={food.carbs}
          fat={food.fat}
        />
        
        <View style={styles.actionButtons}>
          <Button
            title="Delete Food"
            onPress={handleDelete}
            variant="outline"
            color="error"
            fullWidth
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    width: 10,
    height: 16,
    position: 'relative',
  },
  backArrowLine1: {
    width: 10,
    height: 2,
    backgroundColor: Theme.colors.text,
    position: 'absolute',
    top: 4,
    left: 0,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
  },
  backArrowLine2: {
    width: 10,
    height: 2,
    backgroundColor: Theme.colors.text,
    position: 'absolute',
    bottom: 4,
    left: 0,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  editButton: {
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
  },
  editText: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.primary,
  },
  foodInfoSection: {
    marginBottom: Theme.spacing.lg,
  },
  foodName: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  timestamp: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.sm,
  },
  mealTypeContainer: {
    backgroundColor: Theme.colors.card,
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.border.radius.medium,
    alignSelf: 'flex-start',
  },
  mealTypeText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text,
  },
  calorieContainer: {
    alignItems: 'center',
    marginVertical: Theme.spacing.lg,
  },
  calorieValue: {
    fontSize: 48,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  calorieLabel: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textSecondary,
  },
  actionButtons: {
    marginTop: Theme.spacing.xl,
  },
});

export default FoodDetailsScreen; 