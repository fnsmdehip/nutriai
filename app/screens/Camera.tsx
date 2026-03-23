import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';

import { Theme } from '../utils/theme';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addConsumedItem } from '../store/nutritionSlice';
import { incrementDailyScans } from '../store/subscriptionSlice';
import { mergeWithAIResults } from '../services/foodDatabase';
import { shouldShowInterstitial, showInterstitialAd } from '../services/ads';
import { v4 as uuidv4 } from 'uuid';

const CameraScreen = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const dispatch = useAppDispatch();

  const isPremium = useAppSelector((state) => state.subscription.isPremium);
  const foodScansCompleted = useAppSelector((state) => state.subscription.foodScansCompleted);

  // For demo purposes, we'll simulate taking a picture
  const takePicture = () => {
    setCapturedImage(
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1000'
    );
  };

  const analyzePicture = useCallback(async () => {
    try {
      setIsAnalyzing(true);

      // Track the scan
      dispatch(incrementDailyScans());

      // Simulate AI recognition (in production, this calls the Gemini API)
      // The AI would return the food name and estimated nutrition
      const aiName = 'Grilled Chicken Salad';
      const aiNutrition = {
        calories: 350,
        protein: 35,
        carbs: 12,
        fat: 18,
        fiber: 4,
        sugar: 3,
        sodium: 480,
        servingSize: '1 bowl',
      };

      // Cross-reference with USDA database for accuracy
      const enrichedResult = await mergeWithAIResults(aiName, aiNutrition);

      // Add to consumed items
      dispatch(
        addConsumedItem({
          id: uuidv4(),
          name: enrichedResult.name,
          calories: enrichedResult.nutrition.calories,
          protein: enrichedResult.nutrition.protein,
          carbs: enrichedResult.nutrition.carbs,
          fat: enrichedResult.nutrition.fat,
          imageUrl: capturedImage ?? undefined,
          timestamp: Date.now(),
        })
      );

      // Show interstitial ad for free users after every 5th scan
      const newScanCount = foodScansCompleted + 1;
      if (!isPremium && shouldShowInterstitial(newScanCount)) {
        showInterstitialAd();
      }

      // Navigate back to home
      navigation.navigate('Home');
    } catch (error) {
      console.error('[Camera] Analysis failed:', error);
      Alert.alert('Analysis Failed', 'Could not analyze the food. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [dispatch, capturedImage, isPremium, foodScansCompleted, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Food Camera</Text>
        <View style={styles.placeholder} />
      </View>

      {!capturedImage ? (
        <View style={styles.cameraContainer}>
          <View style={styles.mockCamera}>
            <View style={styles.focusGuide} />
            <Text style={styles.guideText}>Position your food in the center</Text>

            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} resizeMode="cover" />

          {isAnalyzing && (
            <View style={styles.analyzingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.analyzingText}>Analyzing food...</Text>
              <Text style={styles.analyzingSubtext}>
                Cross-referencing with USDA database
              </Text>
            </View>
          )}

          <View style={styles.previewControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setCapturedImage(null)}
              disabled={isAnalyzing}
            >
              <Text style={styles.controlButtonText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.primaryButton]}
              onPress={analyzePicture}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.primaryButtonText}>Analyze</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockCamera: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  focusGuide: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 20,
    marginBottom: 20,
  },
  guideText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 40,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000',
  },
  previewContainer: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  analyzingSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 8,
  },
  previewControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 14,
    marginHorizontal: 8,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: '#fff',
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CameraScreen;
