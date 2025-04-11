import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { HomeStackParamList } from '../../navigation/MainNavigator';
import { addFood } from '../../store/nutritionSlice';
import { Theme } from '../../utils/theme';
import Button from '../../components/common/Button';

type AddFoodScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'AddFood'>;

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

const AddFoodScreen = () => {
  const navigation = useNavigation<AddFoodScreenNavigationProp>();
  const dispatch = useDispatch();
  
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [mealType, setMealType] = useState<MealType>('breakfast');
  
  const handleAddFood = () => {
    if (!foodName || !calories) {
      // Show error message - at minimum need food name and calories
      return;
    }
    
    const newFood = {
      id: uuidv4(),
      name: foodName,
      calories: parseInt(calories, 10) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      mealType,
      timestamp: new Date().toISOString(),
    };
    
    dispatch(addFood(newFood));
    navigation.goBack();
  };
  
  const handleCancel = () => {
    navigation.goBack();
  };
  
  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Add Food</Text>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddFood}
              hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.formContainer}>
            {/* Food Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Food Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter food name"
                value={foodName}
                onChangeText={setFoodName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
            
            {/* Calories */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Calories</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter calories"
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
              />
            </View>
            
            {/* Macros Row */}
            <View style={styles.macrosRow}>
              {/* Protein */}
              <View style={styles.macroInput}>
                <Text style={styles.label}>Protein (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={protein}
                  onChangeText={setProtein}
                  keyboardType="numeric"
                />
              </View>
              
              {/* Carbs */}
              <View style={styles.macroInput}>
                <Text style={styles.label}>Carbs (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={carbs}
                  onChangeText={setCarbs}
                  keyboardType="numeric"
                />
              </View>
              
              {/* Fat */}
              <View style={styles.macroInput}>
                <Text style={styles.label}>Fat (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={fat}
                  onChangeText={setFat}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            {/* Meal Type Selection */}
            <View style={styles.mealTypeContainer}>
              <Text style={styles.sectionTitle}>Meal Type</Text>
              <View style={styles.mealTypeOptions}>
                {mealTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.mealTypeButton,
                      mealType === type && styles.mealTypeButtonActive,
                    ]}
                    onPress={() => setMealType(type)}
                  >
                    <Text
                      style={[
                        styles.mealTypeText,
                        mealType === type && styles.mealTypeTextActive,
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button 
              title="Add Food"
              onPress={handleAddFood}
              variant="primary"
              fullWidth
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  headerTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  cancelButton: {
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
  },
  cancelText: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textSecondary,
  },
  saveButton: {
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
  },
  saveText: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.primary,
  },
  formContainer: {
    padding: Theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: Theme.spacing.md,
  },
  label: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  input: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  macroInput: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  mealTypeContainer: {
    marginBottom: Theme.spacing.lg,
  },
  mealTypeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mealTypeButton: {
    backgroundColor: Theme.colors.card,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.border.radius.medium,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  mealTypeButtonActive: {
    backgroundColor: `${Theme.colors.primary}10`,
    borderColor: Theme.colors.primary,
  },
  mealTypeText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text,
  },
  mealTypeTextActive: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  buttonContainer: {
    padding: Theme.spacing.lg,
    paddingTop: 0,
  },
});

export default AddFoodScreen; 