import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  Easing,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import { Theme } from '../utils/theme';
import { haptics } from '../utils/haptics';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addConsumedItem } from '../store/nutritionSlice';
import { incrementDailyScans } from '../store/subscriptionSlice';
import type { Food } from '../store/nutritionSlice';

const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY ?? '';
const GEMINI_FLASH_ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

interface GeminiNutritionResponse {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

async function analyzeImageWithGemini(imageUri: string): Promise<GeminiNutritionResponse> {
  const manipulated = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 768 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true },
  );

  if (!manipulated.base64) {
    throw new Error('Failed to encode image as base64');
  }

  const response = await fetch(GEMINI_FLASH_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: 'Analyze this food image. Return ONLY a valid JSON object with these exact keys: "name" (string, the food name), "calories" (number, estimated total kcal), "protein" (number, grams), "carbs" (number, grams), "fat" (number, grams). No markdown, no explanation, just the JSON object.',
            },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: manipulated.base64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 256,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const rawText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  // Strip markdown code fences if present
  const cleaned = rawText
    .replace(/```(?:json)?\s*/gi, '')
    .replace(/```/g, '')
    .trim();
  const parsed = JSON.parse(cleaned) as GeminiNutritionResponse;

  // Validate the required fields exist and are numbers
  if (
    typeof parsed.name !== 'string' ||
    typeof parsed.calories !== 'number' ||
    typeof parsed.protein !== 'number' ||
    typeof parsed.carbs !== 'number' ||
    typeof parsed.fat !== 'number'
  ) {
    throw new Error('Invalid nutrition data received from AI');
  }

  return {
    name: parsed.name,
    calories: Math.round(parsed.calories),
    protein: Math.round(parsed.protein),
    carbs: Math.round(parsed.carbs),
    fat: Math.round(parsed.fat),
  };
}

const AnalyzingOverlay = (): React.JSX.Element => {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  const dotAnim1 = useRef(new Animated.Value(0)).current;
  const dotAnim2 = useRef(new Animated.Value(0)).current;
  const dotAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );

    const makeDotAnim = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      );

    spin.start();
    pulse.start();
    makeDotAnim(dotAnim1, 0).start();
    makeDotAnim(dotAnim2, 200).start();
    makeDotAnim(dotAnim3, 400).start();

    return () => {
      spin.stop();
      pulse.stop();
    };
  }, [spinAnim, pulseAnim, dotAnim1, dotAnim2, dotAnim3]);

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={overlayStyles.container}>
      <View style={overlayStyles.content}>
        <Animated.View style={[overlayStyles.outerRing, { opacity: pulseAnim }]}>
          <Animated.View
            style={[overlayStyles.spinnerRing, { transform: [{ rotate: spinInterpolate }] }]}
          >
            <View style={overlayStyles.spinnerArc} />
          </Animated.View>
          <View style={overlayStyles.iconCircle}>
            <Ionicons name="sparkles" size={32} color={Theme.colors.primary} />
          </View>
        </Animated.View>

        <Text style={overlayStyles.title}>Analyzing your food</Text>

        <View style={overlayStyles.dotsRow}>
          {[dotAnim1, dotAnim2, dotAnim3].map((anim, i) => (
            <Animated.View
              key={i}
              style={[
                overlayStyles.dot,
                { opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) },
              ]}
            />
          ))}
        </View>

        <View style={overlayStyles.stepsContainer}>
          {['Identifying food items', 'Estimating portions', 'Calculating nutrition'].map(
            (label, idx) => (
              <View key={label} style={overlayStyles.stepRow}>
                <View style={[overlayStyles.stepDot, idx === 0 && overlayStyles.stepDotActive]} />
                <Text style={[overlayStyles.stepLabel, idx === 0 && overlayStyles.stepLabelActive]}>
                  {label}
                </Text>
              </View>
            ),
          )}
        </View>
      </View>
    </View>
  );
};

const CameraScreen = (): React.JSX.Element => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<Food | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const dispatch = useAppDispatch();

  const isPremium = useAppSelector(state => state.subscription.isPremium);
  const dailyScansUsed = useAppSelector(state => state.subscription.dailyScansUsed);
  const dailyScanLimit = useAppSelector(state => state.subscription.dailyScanLimit);

  const scansRemaining = isPremium ? null : Math.max(0, dailyScanLimit - dailyScansUsed);

  const takePicture = useCallback(async (): Promise<void> => {
    if (!cameraRef.current) return;
    haptics.medium();
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo?.uri) {
        setCapturedImage(photo.uri);
      }
    } catch {
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }
  }, []);

  const pickFromGallery = useCallback(async (): Promise<void> => {
    haptics.light();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

    if (!isPremium && scansRemaining !== null && scansRemaining <= 0) {
      haptics.error();
      Alert.alert('Daily Limit Reached', 'Upgrade to Premium for unlimited scans.', [
        { text: 'Upgrade', onPress: () => navigation.navigate('Paywall') },
        { text: 'OK', style: 'cancel' },
      ]);
      return;
    }

    try {
      haptics.light();
      setIsAnalyzing(true);
      dispatch(incrementDailyScans());

      const nutrition = await analyzeImageWithGemini(capturedImage);

      const foodResult: Food = {
        id: `food-${Date.now()}`,
        name: nutrition.name,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        imageUrl: capturedImage,
        timestamp: Date.now(),
      };

      haptics.success();
      setAnalysisResult(foodResult);
    } catch {
      haptics.error();
      Alert.alert('Analysis Failed', 'Could not analyze the food image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [capturedImage, dispatch, isPremium, scansRemaining, navigation]);

  const confirmAndSave = useCallback((): void => {
    if (!analysisResult) return;
    haptics.success();
    dispatch(addConsumedItem(analysisResult));
    navigation.goBack();
  }, [analysisResult, dispatch, navigation]);

  const resetCamera = useCallback((): void => {
    haptics.light();
    setCapturedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  }, []);

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <View style={styles.loadingPulse} />
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              haptics.light();
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Food Scanner</Text>
          <View style={styles.navPlaceholder} />
        </View>
        <View style={styles.centeredContent}>
          <View style={styles.permissionIconContainer}>
            <Ionicons name="camera-outline" size={48} color={Theme.colors.primary} />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionDescription}>
            NutriAI needs camera access to scan and analyze your food for nutrition information.
          </Text>
          {permission.canAskAgain ? (
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={() => {
                haptics.light();
                requestPermission();
              }}
            >
              <Text style={styles.permissionButtonText}>Grant Camera Access</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={() => {
                haptics.light();
                Linking.openSettings();
              }}
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
              <View style={styles.resultMacroDivider} />
              <View style={styles.resultMacroItem}>
                <Text style={[styles.resultMacroValue, { color: Theme.colors.protein }]}>
                  {analysisResult.protein}g
                </Text>
                <Text style={styles.resultMacroLabel}>Protein</Text>
              </View>
              <View style={styles.resultMacroDivider} />
              <View style={styles.resultMacroItem}>
                <Text style={[styles.resultMacroValue, { color: Theme.colors.carbs }]}>
                  {analysisResult.carbs}g
                </Text>
                <Text style={styles.resultMacroLabel}>Carbs</Text>
              </View>
              <View style={styles.resultMacroDivider} />
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

  if (capturedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewWrapper}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} resizeMode="cover" />

          {isAnalyzing ? (
            <AnalyzingOverlay />
          ) : (
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

  return (
    <SafeAreaView style={styles.cameraContainer}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <View style={styles.cameraTopBar}>
          <TouchableOpacity
            style={styles.cameraNavButton}
            onPress={() => {
              haptics.light();
              navigation.goBack();
            }}
          >
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

        <View style={styles.focusArea}>
          <View style={styles.focusGuide}>
            <View style={[styles.focusCorner, styles.focusTopLeft]} />
            <View style={[styles.focusCorner, styles.focusTopRight]} />
            <View style={[styles.focusCorner, styles.focusBottomLeft]} />
            <View style={[styles.focusCorner, styles.focusBottomRight]} />
          </View>
          <Text style={styles.focusText}>Center your food in the frame</Text>
        </View>

        <View style={styles.captureArea}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture} activeOpacity={0.7}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </SafeAreaView>
  );
};

const overlayStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 26, 46, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  outerRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  spinnerRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: Theme.colors.primary,
    borderRightColor: 'rgba(46, 213, 115, 0.3)',
  },
  spinnerArc: {
    width: 0,
    height: 0,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.primary,
  },
  stepsContainer: {
    gap: 14,
    width: '100%',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.inactive,
  },
  stepDotActive: {
    backgroundColor: Theme.colors.primary,
  },
  stepLabel: {
    fontSize: 15,
    color: Theme.colors.inactive,
  },
  stepLabelActive: {
    color: Theme.colors.text,
    fontWeight: '600',
  },
});

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
  loadingPulse: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Theme.colors.surface,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  navPlaceholder: {
    width: 44,
  },

  permissionIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionDescription: {
    fontSize: 16,
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
    minHeight: 52,
    justifyContent: 'center',
    ...Theme.shadow.medium,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  galleryFallback: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
    minHeight: 44,
  },
  galleryFallbackText: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },

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
  focusGuide: {
    width: 260,
    height: 260,
    position: 'relative',
    marginBottom: 16,
  },
  focusCorner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: 'rgba(46, 213, 115, 0.8)',
  },
  focusTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 16,
  },
  focusTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 16,
  },
  focusBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 16,
  },
  focusBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 16,
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

  previewWrapper: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
    width: '100%',
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
    minHeight: 52,
  },
  previewRetakeText: {
    color: Theme.colors.text,
    fontSize: 16,
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
    minHeight: 52,
  },
  previewAnalyzeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

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
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    ...Theme.shadow.medium,
  },
  resultFoodName: {
    fontSize: 24,
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
    fontSize: 20,
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
    minHeight: 52,
  },
  retakeButtonText: {
    color: Theme.colors.text,
    fontSize: 16,
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
    minHeight: 52,
    ...Theme.shadow.medium,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CameraScreen;
