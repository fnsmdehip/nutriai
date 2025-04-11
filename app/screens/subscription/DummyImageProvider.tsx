import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Theme } from '../../utils/theme';

// This component serves as a placeholder for camera preview images
// In a real app, you would use actual images from the assets folder

interface DummyImageProviderProps {
  type: 'camera-preview' | 'food-photo';
  style?: any;
}

const DummyImageProvider: React.FC<DummyImageProviderProps> = ({ type, style }) => {
  const getImageContent = () => {
    switch (type) {
      case 'camera-preview':
        return (
          <View style={styles.cameraPreviewContainer}>
            <View style={styles.foodItem1} />
            <View style={styles.foodItem2} />
            <View style={styles.foodItem3} />
            <View style={styles.plate} />
          </View>
        );
      case 'food-photo':
        return (
          <View style={styles.foodPhotoContainer}>
            <View style={styles.food} />
          </View>
        );
      default:
        return <View style={styles.emptyPlaceholder} />;
    }
  };

  return <View style={[styles.container, style]}>{getImageContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.border,
  },
  cameraPreviewContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  plate: {
    width: '60%',
    height: '60%',
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: '15%',
  },
  foodItem1: {
    width: '25%',
    height: '15%',
    borderRadius: 10,
    backgroundColor: Theme.colors.carbs,
    position: 'absolute',
    top: '25%',
    left: '30%',
    transform: [{ rotate: '-15deg' }],
  },
  foodItem2: {
    width: '30%',
    height: '10%',
    borderRadius: 10,
    backgroundColor: Theme.colors.protein,
    position: 'absolute',
    top: '35%',
    right: '25%',
    transform: [{ rotate: '10deg' }],
  },
  foodItem3: {
    width: '20%',
    height: '20%',
    borderRadius: 20,
    backgroundColor: Theme.colors.fat,
    position: 'absolute',
    bottom: '30%',
    left: '35%',
  },
  foodPhotoContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  food: {
    width: '70%',
    height: '70%',
    borderRadius: 35,
    backgroundColor: Theme.colors.primary,
    opacity: 0.7,
  },
});

export default DummyImageProvider; 