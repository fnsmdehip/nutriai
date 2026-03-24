import React, { useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

import { Theme } from '../utils/theme';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addConsumedItem } from '../store/nutritionSlice';
import { incrementDailyScans } from '../store/subscriptionSlice';
import type { Food } from '../store/nutritionSlice';

const CameraScreen = (): React.JSX.Element => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<Food | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const dispatch = useAppDispatch();

  const isPremium = useAppSelector((state) => state.subscription.isPremium);
  const dailyScansUsed = useAppSelector((state) => state.subscription.dailyScansUsed);
  const dailyScanLimit = useAppSelector((state) => state.subscription.dailyScanLimit);

  const scansRemaining = isPremium ? null : Math.max(0, dailyScanLimit - dailyScansUsed);

  const takePicture = useCallback(async (): Promise<void> => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      if (photo?.uri) {
        setCapturedImage(photo.uri);
      }
    } catch {
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }
  }, []);

  const pickFromGallery = useCallback(async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
    }
  }, []);

  const analyzePicture = useCallback(async (): Promise<void> => {
    if (!capturedImage) return;

    // Check scan limit for free users
    if (!isPremium && scansRemaining !== null && scansRemaining <= 0) {
      Alert.alert(
        'Daily Limit Reached',
        'You have used all free scans for today. Upgrade to Premium for unlimited scans.',
        [
          { text: 'Upgrade', onPress: () => navigation.navigate('Paywall') },
          { text: 'OK', style: 'cancel' },
        ]
      );
      return;
    }

    try {
      setIsAnalyzing(true);
      dispatch(incrementDailyScans());

      // Simulate AI analysis delay (in production, call Gemini/GPT Vision API)
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 2000);
      });

      const foodResult: Food = {
        id: `food-${Date.now()}`,
        name: 'Grilled Chicken Salad',
        calories: 350,
        protein: 35,
        carbs: 12,
        fat: 18,
        imageUrl: capturedImage,
        timestamp: Date.now(),
      };

      setAnalysisResult(foodResult);
    } catch {
      Alert.alert('Analysis Failed', 'Could not analyze the food image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [capturedImage, dispatch, isPremium, scansRemaining, navigation]);

  const confirmAndSave = useCallback((): void => {
    if (!analysisResult) return;
    dispatch(addConsumedItem(analysisResult));
    navigation.goBack();
  }, [analysisResult, dispatch, navigation]);

  const resetCamera = useCallback((): void => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  }, []);

  // Permission not yet determined
  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Food Scanner</Text>
          <View style={styles.navPlaceholder} />
        </View>
        <View style={styles.centeredContent}>
          <View style={styles.permissionIconContainer}>
            <Ionicons name="camera-outline" size={48} color={Theme.colors.inactive} />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionDescription}>
            NutriAI needs camera access to scan and analyze your food for nutrition information.
          </Text>
          {permission.canAskAgain ? (
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>Grant Camera Access</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={() => Linking.openSettings()}
            >
              <Text style={styles.permissionButtonText}>Open Settings</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.galleryFallback} onPress={pickFromGallery}>
            <Ionicons name="images-outline" size={20} color={Theme.colors.primary} />
            <Text style={styles.galleryFallbackText}>Choose from Gallery Instead</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Analysis result view
  if (analysisResult) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.backButton} onPress={resetCamera}>
            <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Analysis Result</Text>
          <View style={styles.navPlaceholder} />
        </View>

        <View style={styles.resultContainer}>
          {capturedImage && (
            <Image source={{ uri: capturedImage }} style={styles.resultImage} resizeMode="cover" />
          )}

          <View style={styles.resultCard}>
            <Text style={styles.resultFoodName}>{analysisResult.name}</Text>

            <View style={styles.resultMacroGrid}>
              <View style={styles.resultMacroItem}>
                <Text style={styles.resultMacroValue}>{analysisResult.calories}</Text>
                <Text style={styles.resultMacroLabel}>Calories</Text>
              </View>
              <View style={[styles.resultMacroDivider]} />
              <View style={styles.resultMacroItem}>
                <Text style={[styles.resultMacroValue, { color: Theme.colors.protein }]}>
                  {analysisResult.protein}g
                </Text>
                <Text style={styles.resultMacroLabel}>Protein</Text>
              </View>
              <View style={[styles.resultMacroDivider]} />
              <View style={styles.resultMacroItem}>
                <Text style={[styles.resultMacroValue, { color: Theme.colors.carbs }]}>
                  {analysisResult.carbs}g
                </Text>
                <Text style={styles.resultMacroLabel}>Carbs</Text>
              </View>
              <View style={[styles.resultMacroDivider]} />
              <View style={styles.resultMacroItem}>
                <Text style={[styles.resultMacroValue, { color: Theme.colors.fat }]}>
                  {analysisResult.fat}g
                </Text>
                <Text style={styles.resultMacroLabel}>Fat</Text>
              </View>
            </View>
          </View>

          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.retakeButton} onPress={resetCamera}>
              <Ionicons name="refresh" size={20} color={Theme.colors.text} />
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={confirmAndSave}>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <Text style={styles.confirmButtonText}>Log Food</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Image preview / analyzing state
  if (capturedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewWrapper}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} resizeMode="cover" />

          {isAnalyzing && (
            <View style={styles.analyzingOverlay}>
              <ActivityIndicator size="large" color={Theme.colors.primary} />
              <Text style={styles.analyzingTitle}>Analyzing your food...</Text>
              <Text style={styles.analyzingSubtitle}>
                Identifying ingredients and estimating nutrition
              </Text>
            </View>
          )}

          {!isAnalyzing && (
            <View style={styles.previewControls}>
              <TouchableOpacity style={styles.previewRetake} onPress={resetCamera}>
                <Ionicons name="close" size={22} color={Theme.colors.text} />
                <Text style={styles.previewRetakeText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.previewAnalyze} onPress={analyzePicture}>
                <Ionicons name="sparkles" size={20} color="#FFFFFF" />
                <Text style={styles.previewAnalyzeText}>Analyze Food</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Camera live view
  return (
    <SafeAreaView style={styles.cameraContainer}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        {/* Top bar */}
        <View style={styles.cameraTopBar}>
          <TouchableOpacity style={styles.cameraNavButton} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={26} color="#FFFFFF" />
          </TouchableOpacity>
          {!isPremium && scansRemaining !== null && (
            <View style={styles.cameraScanBadge}>
              <Text style={styles.cameraScanText}>{scansRemaining} scans left</Text>
            </View>
          )}
          <TouchableOpacity style={styles.cameraNavButton} onPress={pickFromGallery}>
            <Ionicons name="images-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Focus guide */}
        <View style={styles.focusArea}>
          <View style={styles.focusCorner} />
          <Text style={styles.focusText}>Center your food in the frame</Text>
        </View>

        {/* Capture button */}
        <View style={styles.captureArea}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture} activeOpacity={0.7}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  navPlaceholder: {
    width: 40,
  },

  // Permission denied state
  permissionIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionDescription: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: Theme.border.radius.large,
    marginBottom: 20,
    ...Theme.shadow.medium,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '700',
  },
  galleryFallback: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  galleryFallbackText: {
    color: Theme.colors.primary,
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Camera live view
  camera: {
    flex: 1,
  },
  cameraTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  cameraNavButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraScanBadge: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cameraScanText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  focusArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusCorner: {
    width: 240,
    height: 240,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 24,
    marginBottom: 16,
  },
  focusText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  captureArea: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },

  // Preview state
  previewWrapper: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11,26,46,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingTitle: {
    color: '#FFFFFF',
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '700',
    marginTop: 20,
  },
  analyzingSubtitle: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.typography.fontSize.sm,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  previewControls: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  previewRetake: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: Theme.border.radius.medium,
    backgroundColor: Theme.colors.surface,
    gap: 8,
  },
  previewRetakeText: {
    color: Theme.colors.text,
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
  },
  previewAnalyze: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: Theme.border.radius.medium,
    backgroundColor: Theme.colors.primary,
    gap: 8,
  },
  previewAnalyzeText: {
    color: '#FFFFFF',
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '700',
  },

  // Result state
  resultContainer: {
    flex: 1,
  },
  resultImage: {
    width: '100%',
    height: 260,
  },
  resultCard: {
    backgroundColor: Theme.colors.surface,
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: Theme.border.radius.medium,
    padding: 24,
    ...Theme.shadow.medium,
  },
  resultFoodName: {
    fontSize: Theme.typography.fontSize.xxl,
    fontWeight: '700',
    color: Theme.colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  resultMacroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  resultMacroItem: {
    alignItems: 'center',
    flex: 1,
  },
  resultMacroDivider: {
    width: 1,
    height: 36,
    backgroundColor: Theme.colors.border,
  },
  resultMacroValue: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  resultMacroLabel: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  resultActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: Theme.border.radius.medium,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    gap: 8,
  },
  retakeButtonText: {
    color: Theme.colors.text,
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: Theme.border.radius.medium,
    backgroundColor: Theme.colors.primary,
    gap: 8,
    ...Theme.shadow.medium,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '700',
  },
});

export default CameraScreen;
