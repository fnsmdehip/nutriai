import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { RecognizedFood } from '../../services/aiService';
import { Theme } from '../../utils/theme';

interface FoodRecognitionResultsProps {
  isProcessing: boolean;
  foods: RecognizedFood[];
  imageUri: string;
  modelUsed: string;
  processingTime: number;
  onAddFood: (food: RecognizedFood) => void;
  onEditFood: (food: RecognizedFood) => void;
  onClose: () => void;
  onRetry: () => void;
}

const FoodRecognitionResults: React.FC<FoodRecognitionResultsProps> = ({
  isProcessing,
  foods,
  imageUri,
  modelUsed,
  processingTime,
  onAddFood,
  onEditFood,
  onClose,
  onRetry,
}) => {
  
  const renderFoodItem = ({ item }: { item: RecognizedFood }) => (
    <View style={styles.foodItem}>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.portionText}>
          {item.portion} {item.unit}
        </Text>
        <View style={styles.macroRow}>
          <Text style={styles.calorieText}>{item.calories} cal</Text>
          <Text style={styles.macroText}>P: {item.protein}g</Text>
          <Text style={styles.macroText}>C: {item.carbs}g</Text>
          <Text style={styles.macroText}>F: {item.fat}g</Text>
        </View>
        <View style={styles.confidenceBar}>
          <View 
            style={[
              styles.confidenceFill, 
              { width: `${item.confidence * 100}%` },
              item.confidence > 0.7 
                ? styles.highConfidence 
                : styles.lowConfidence
            ]} 
          />
        </View>
        <Text style={styles.confidenceText}>
          Confidence: {Math.round(item.confidence * 100)}%
        </Text>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => onEditFood(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => onAddFood(item)}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isProcessing) {
    return (
      <View style={styles.processingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={styles.processingText}>Analyzing your food...</Text>
        <Image 
          source={{ uri: imageUri }} 
          style={styles.previewImage}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recognition Results</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageUri }} 
          style={styles.previewImage}
          resizeMode="cover"
        />
      </View>
      
      {foods.length > 0 ? (
        <>
          <FlatList
            data={foods}
            renderItem={renderFoodItem}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            contentContainerStyle={styles.listContainer}
          />
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Analyzed with {modelUsed} in {processingTime.toFixed(1)}s
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            No food detected in this image
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
  },
  processingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Theme.colors.inactive,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    backgroundColor: '#000',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  foodInfo: {
    flex: 1,
    marginRight: 16,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  portionText: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    marginBottom: 8,
  },
  macroRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  calorieText: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.primary,
    marginRight: 12,
  },
  macroText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginRight: 8,
  },
  confidenceBar: {
    height: 4,
    backgroundColor: Theme.colors.inactive,
    borderRadius: 2,
    marginBottom: 4,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 2,
  },
  highConfidence: {
    backgroundColor: Theme.colors.success,
  },
  lowConfidence: {
    backgroundColor: Theme.colors.warning,
  },
  confidenceText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  actionButtons: {
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  editButton: {
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  editButtonText: {
    color: Theme.colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  infoContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  infoText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default FoodRecognitionResults; 