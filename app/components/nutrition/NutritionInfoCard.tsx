import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../utils/theme';

interface NutritionInfoCardProps {
  protein: number;
  carbs: number;
  fat: number;
  showPercentages?: boolean;
}

const NutritionInfoCard: React.FC<NutritionInfoCardProps> = ({
  protein,
  carbs,
  fat,
  showPercentages = false,
}) => {
  // Calculate total calories and percentages
  const proteinCalories = protein * 4; // 4 cal per gram of protein
  const carbsCalories = carbs * 4; // 4 cal per gram of carbs
  const fatCalories = fat * 9; // 9 cal per gram of fat
  const totalCalories = proteinCalories + carbsCalories + fatCalories;
  
  const proteinPercentage = totalCalories > 0 ? (proteinCalories / totalCalories) * 100 : 0;
  const carbsPercentage = totalCalories > 0 ? (carbsCalories / totalCalories) * 100 : 0;
  const fatPercentage = totalCalories > 0 ? (fatCalories / totalCalories) * 100 : 0;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrition Facts</Text>
      
      <View style={styles.divider} />
      
      {/* Protein Row */}
      <View style={styles.nutrientRow}>
        <View style={styles.nutrientLabelContainer}>
          <View style={[styles.colorIndicator, { backgroundColor: Theme.colors.protein }]} />
          <Text style={styles.nutrientLabel}>Protein</Text>
        </View>
        
        <View style={styles.nutrientValueContainer}>
          <Text style={styles.nutrientValue}>{protein}g</Text>
          {showPercentages && (
            <Text style={styles.nutrientPercentage}>
              {Math.round(proteinPercentage)}%
            </Text>
          )}
        </View>
      </View>
      
      {/* Carbs Row */}
      <View style={styles.nutrientRow}>
        <View style={styles.nutrientLabelContainer}>
          <View style={[styles.colorIndicator, { backgroundColor: Theme.colors.carbs }]} />
          <Text style={styles.nutrientLabel}>Carbohydrates</Text>
        </View>
        
        <View style={styles.nutrientValueContainer}>
          <Text style={styles.nutrientValue}>{carbs}g</Text>
          {showPercentages && (
            <Text style={styles.nutrientPercentage}>
              {Math.round(carbsPercentage)}%
            </Text>
          )}
        </View>
      </View>
      
      {/* Fat Row */}
      <View style={styles.nutrientRow}>
        <View style={styles.nutrientLabelContainer}>
          <View style={[styles.colorIndicator, { backgroundColor: Theme.colors.fat }]} />
          <Text style={styles.nutrientLabel}>Fat</Text>
        </View>
        
        <View style={styles.nutrientValueContainer}>
          <Text style={styles.nutrientValue}>{fat}g</Text>
          {showPercentages && (
            <Text style={styles.nutrientPercentage}>
              {Math.round(fatPercentage)}%
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.divider} />
      
      {/* Macronutrient Bar */}
      <View style={styles.macroBarContainer}>
        <View
          style={[
            styles.macroBarSegment,
            {
              backgroundColor: Theme.colors.protein,
              flex: proteinPercentage,
            },
          ]}
        />
        <View
          style={[
            styles.macroBarSegment,
            {
              backgroundColor: Theme.colors.carbs,
              flex: carbsPercentage,
            },
          ]}
        />
        <View
          style={[
            styles.macroBarSegment,
            {
              backgroundColor: Theme.colors.fat,
              flex: fatPercentage > 0 ? fatPercentage : 0.001, // Ensure visibility even if 0%
            },
          ]}
        />
      </View>
      
      {/* Calorie Breakdown */}
      <View style={styles.calorieBreakdownContainer}>
        <Text style={styles.calorieBreakdownText}>
          Protein: {proteinCalories} cal
        </Text>
        <Text style={styles.calorieBreakdownText}>
          Carbs: {carbsCalories} cal
        </Text>
        <Text style={styles.calorieBreakdownText}>
          Fat: {fatCalories} cal
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
    padding: Theme.spacing.md,
    ...Theme.shadow.small,
  },
  title: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginVertical: Theme.spacing.sm,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Theme.spacing.xs,
  },
  nutrientLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Theme.spacing.xs,
  },
  nutrientLabel: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text,
  },
  nutrientValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutrientValue: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
    marginRight: Theme.spacing.sm,
  },
  nutrientPercentage: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
  macroBarContainer: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: Theme.spacing.sm,
  },
  macroBarSegment: {
    height: '100%',
  },
  calorieBreakdownContainer: {
    marginTop: Theme.spacing.sm,
  },
  calorieBreakdownText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginVertical: 2,
  },
});

export default NutritionInfoCard; 