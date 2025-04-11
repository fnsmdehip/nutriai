import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import FoodCamera from '../../components/nutrition/FoodCamera';
import FoodRecognitionResults from '../../components/nutrition/FoodRecognitionResults';
import { RecognizedFood, recognizeFood } from '../../services/aiService';
import { addFood } from '../../store/nutritionSlice';
import { MainStackParamList } from '../../navigation/types';

type FoodRecognitionScreenProps = {
  navigation: StackNavigationProp<MainStackParamList, 'FoodRecognition'>;
};

const FoodRecognitionScreen: React.FC<FoodRecognitionScreenProps> = ({ navigation }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedFoods, setRecognizedFoods] = useState<RecognizedFood[]>([]);
  const [modelUsed, setModelUsed] = useState('');
  const [processingTime, setProcessingTime] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    // Process the image when it's captured
    if (imageUri) {
      processFoodImage(imageUri);
    }
  }, [imageUri]);

  const processFoodImage = async (uri: string) => {
    setIsProcessing(true);
    try {
      const result = await recognizeFood(uri);
      setRecognizedFoods(result.foods || []);
      setModelUsed(result.modelUsed);
      setProcessingTime(result.processingTime);
    } catch (error) {
      Alert.alert(
        'Recognition Failed',
        'Failed to recognize food in the image. Please try again.',
        [{ text: 'OK' }]
      );
      console.error('Food recognition error:', error);
      setRecognizedFoods([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCapture = (uri: string) => {
    setImageUri(uri);
  };

  const handleAddFood = (food: RecognizedFood) => {
    dispatch(addFood({
      id: Date.now().toString(),
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      imageUrl: imageUri || undefined,
      timestamp: new Date().toISOString(),
      mealType: 'lunch', // Default meal type
    }));
    
    Alert.alert('Success', `Added ${food.name} to your food diary`);
    navigation.goBack();
  };

  const handleEditFood = (food: RecognizedFood) => {
    // Navigate to food edit screen with pre-filled values
    navigation.navigate('EditFood', { food });
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleRetry = () => {
    setImageUri(null);
    setRecognizedFoods([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {!imageUri ? (
        <FoodCamera 
          onCapture={handleCapture} 
          onCancel={handleClose} 
        />
      ) : (
        <FoodRecognitionResults
          isProcessing={isProcessing}
          foods={recognizedFoods}
          imageUri={imageUri}
          modelUsed={modelUsed}
          processingTime={processingTime}
          onAddFood={handleAddFood}
          onEditFood={handleEditFood}
          onClose={handleClose}
          onRetry={handleRetry}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default FoodRecognitionScreen; 