import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FoodItem } from '../../store/nutritionSlice';
import { Theme } from '../../utils/theme';

interface FoodListItemProps {
  food: FoodItem;
  onPress?: () => void;
}

const FoodListItem: React.FC<FoodListItemProps> = ({ food, onPress }) => {
  // Format the timestamp to show only the time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get label for meal type
  const getMealTypeLabel = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return 'Breakfast';
      case 'lunch':
        return 'Lunch';
      case 'dinner':
        return 'Dinner';
      case 'snack':
        return 'Snack';
      default:
        return 'Meal';
    }
  };
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Food Image */}
      <View style={styles.imageContainer}>
        {food.imageUrl ? (
          <Image source={{ uri: food.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
      </View>
      
      {/* Food Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.foodName}>{food.name}</Text>
        
        <View style={styles.metaContainer}>
          <Text style={styles.mealType}>
            {getMealTypeLabel(food.mealType)}
          </Text>
          <Text style={styles.timestamp}>{formatTime(food.timestamp)}</Text>
        </View>
      </View>
      
      {/* Nutrition Summary */}
      <View style={styles.nutritionContainer}>
        <Text style={styles.calories}>{food.calories}</Text>
        <Text style={styles.caloriesLabel}>cal</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
    marginBottom: Theme.spacing.m,
    padding: Theme.spacing.m,
    ...Theme.shadow.small,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: Theme.border.radius.small,
    overflow: 'hidden',
    marginRight: Theme.spacing.m,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.border,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  foodName: {
    fontSize: Theme.typography.fontSize.medium,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealType: {
    fontSize: Theme.typography.fontSize.small,
    color: Theme.colors.textSecondary,
    marginRight: Theme.spacing.s,
  },
  timestamp: {
    fontSize: Theme.typography.fontSize.small,
    color: Theme.colors.textSecondary,
  },
  nutritionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Theme.spacing.m,
  },
  calories: {
    fontSize: Theme.typography.fontSize.large,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  caloriesLabel: {
    fontSize: Theme.typography.fontSize.small,
    color: Theme.colors.textSecondary,
  },
});

export default FoodListItem; 