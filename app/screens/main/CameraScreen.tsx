import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { RNCamera } from 'react-native-camera';
import { HomeStackParamList } from '../../navigation/MainNavigator';
import { startPhotoProcessing, finishPhotoProcessing, addFood } from '../../store/nutritionSlice';
import { Theme } from '../../utils/theme';
import Button from '../../components/common/Button';
import { v4 as uuidv4 } from 'uuid';

type CameraScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Camera'>;

const CameraScreen = () => {
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const dispatch = useDispatch();
  const cameraRef = useRef<RNCamera>(null);
  
  const [processing, setProcessing] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [recognizedItems, setRecognizedItems] = useState<string[]>([]);
  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.off);
  
  const takePicture = async () => {
    if (cameraRef.current && !processing) {
      setProcessing(true);
      
      try {
        const options = { quality: 0.8, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);
        
        setPhotoUri(data.uri);
        
        // Simulate AI recognition
        setTimeout(() => {
          const mockItems = ['Chicken Breast', 'Brown Rice', 'Broccoli'];
          setRecognizedItems(mockItems);
          setProcessing(false);
        }, 2000);
        
      } catch (e) {
        Alert.alert('Error', 'Failed to take picture');
        setProcessing(false);
      }
    }
  };
  
  const handleToggleFlash = () => {
    setFlashMode(
      flashMode === RNCamera.Constants.FlashMode.off
        ? RNCamera.Constants.FlashMode.on
        : RNCamera.Constants.FlashMode.off
    );
  };
  
  const handleAddRecognizedItem = (itemName: string) => {
    // Create a food item with estimated nutrition values
    const mockNutritionValues: Record<string, { calories: number; protein: number; carbs: number; fat: number }> = {
      'Chicken Breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
      'Brown Rice': { calories: 215, protein: 5, carbs: 45, fat: 1.8 },
      'Broccoli': { calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6 },
    };
    
    // Use mock data or defaults
    const nutritionValues = mockNutritionValues[itemName] || {
      calories: 100,
      protein: 5,
      carbs: 10,
      fat: 2,
    };
    
    const newFood = {
      id: uuidv4(),
      name: itemName,
      calories: nutritionValues.calories,
      protein: nutritionValues.protein,
      carbs: nutritionValues.carbs,
      fat: nutritionValues.fat,
      imageUrl: photoUri,
      timestamp: new Date().toISOString(),
      mealType: 'lunch' as const, // Default to lunch
    };
    
    dispatch(addFood(newFood));
    
    // Remove the item from the list
    setRecognizedItems(recognizedItems.filter(item => item !== itemName));
  };
  
  const handleCancel = () => {
    if (photoUri) {
      // Go back to camera
      setPhotoUri(null);
      setRecognizedItems([]);
    } else {
      // Go back to previous screen
      navigation.goBack();
    }
  };
  
  const handleDone = () => {
    // Go back to home screen
    navigation.navigate('Home');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {photoUri ? (
        <View style={styles.reviewContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleCancel}
              hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
            >
              <View style={styles.backArrow}>
                <View style={styles.backArrowLine1} />
                <View style={styles.backArrowLine2} />
              </View>
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Food Recognition</Text>
            
            <TouchableOpacity
              style={styles.doneButton}
              onPress={handleDone}
              hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.photoContainer}>
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
          </View>
          
          <View style={styles.recognizedItemsContainer}>
            <Text style={styles.recognizedTitle}>
              {recognizedItems.length > 0
                ? 'Recognized Items'
                : 'Processing image...'}
            </Text>
            
            {recognizedItems.length === 0 && (
              <ActivityIndicator
                size="large"
                color={Theme.colors.primary}
                style={styles.loader}
              />
            )}
            
            {recognizedItems.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemText}>{item}</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleAddRecognizedItem(item)}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <RNCamera
            ref={cameraRef}
            style={styles.camera}
            type={RNCamera.Constants.Type.back}
            flashMode={flashMode}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            captureAudio={false}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.cameraHeaderContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCancel}
                  hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                >
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.flashButton}
                  onPress={handleToggleFlash}
                  hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                >
                  <Text style={styles.flashButtonText}>
                    {flashMode === RNCamera.Constants.FlashMode.off ? '⚡️ OFF' : '⚡️ ON'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.captureContainer}>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={takePicture}
                  disabled={processing}
                >
                  {processing ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <View style={styles.captureInner} />
                  )}
                </TouchableOpacity>
              </View>
              
              <Text style={styles.instructionText}>
                Center your food in the frame
              </Text>
            </View>
          </RNCamera>
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
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: Theme.spacing.lg,
  },
  cameraHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
  },
  flashButton: {
    padding: Theme.spacing.sm,
    borderRadius: Theme.border.radius.medium,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  flashButtonText: {
    color: '#FFF',
    fontSize: Theme.typography.fontSize.sm,
  },
  captureContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: Theme.colors.primary,
  },
  instructionText: {
    color: '#FFF',
    fontSize: Theme.typography.fontSize.md,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: Theme.spacing.sm,
    borderRadius: Theme.border.radius.medium,
    overflow: 'hidden',
  },
  reviewContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background,
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
  headerTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  doneButton: {
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
  },
  doneText: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.primary,
  },
  photoContainer: {
    height: 300,
    width: '100%',
    backgroundColor: '#000',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  recognizedItemsContainer: {
    padding: Theme.spacing.lg,
    flex: 1,
  },
  recognizedTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  loader: {
    marginVertical: Theme.spacing.lg,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
    marginBottom: Theme.spacing.sm,
    ...Theme.shadow.small,
  },
  itemText: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text,
  },
  addButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.border.radius.small,
  },
  addButtonText: {
    fontSize: Theme.typography.fontSize.sm,
    color: '#FFF',
    fontWeight: '600',
  },
});

export default CameraScreen; 