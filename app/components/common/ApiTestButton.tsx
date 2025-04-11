import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, View, TextInput } from 'react-native';
import aiService from '../../services/aiService';
import { GOOGLE_AI_API_KEY } from '@env';
import { Theme } from '../../utils/theme';

interface ApiTestButtonProps {
  style?: object;
}

const ApiTestButton: React.FC<ApiTestButtonProps> = ({ style }) => {
  const [imageUrl, setImageUrl] = useState(
    'https://www.recipetineats.com/wp-content/uploads/2022/08/Stack-of-beef-smash-burgers_72.jpg',
  );
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    try {
      setLoading(true);

      // Check if the API key is loaded
      if (!GOOGLE_AI_API_KEY) {
        Alert.alert(
          'API Key Missing',
          'The Google AI API key is not loaded from environment variables',
        );
        setLoading(false);
        return;
      }

      // Display the first few characters of the API key
      Alert.alert(
        'API Key Loaded',
        `API key loaded: ${GOOGLE_AI_API_KEY.substring(0, 5)}...${GOOGLE_AI_API_KEY.substring(GOOGLE_AI_API_KEY.length - 5)}`,
        [
          {
            text: 'Test API Call',
            onPress: async () => {
              try {
                alert('Starting food recognition. This may take a few moments...');
                const result = await aiService.recognizeFood(imageUrl);

                // Display the result
                Alert.alert(
                  'API Test Successful',
                  `Model used: ${result.modelUsed}\nProcessing time: ${result.processingTime.toFixed(2)}s\nFoods recognized: ${result.foods.length}\n\nFirst food: ${result.foods[0]?.name || 'None'}\n\nCalories: ${result.foods[0]?.calories || 0}\nProtein: ${result.foods[0]?.protein || 0}g\nCarbs: ${result.foods[0]?.carbs || 0}g\nFat: ${result.foods[0]?.fat || 0}g`,
                );
              } catch (error) {
                Alert.alert(
                  'API Test Failed',
                  `Error: ${error instanceof Error ? error.message : String(error)}`,
                );
              } finally {
                setLoading(false);
              }
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setLoading(false),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'API Test Error',
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      setLoading(false);
    }
  };

  return (
    <View style={style}>
      <Text style={styles.label}>Image URL for testing:</Text>
      <TextInput
        style={styles.input}
        value={imageUrl}
        onChangeText={setImageUrl}
        placeholder="Enter image URL to analyze"
      />
      <TouchableOpacity
        style={[styles.button, loading ? styles.buttonDisabled : null]}
        onPress={testApi}
        disabled={loading}
      >
        <Text style={styles.text}>{loading ? 'Testing...' : 'Test Food Recognition API'}</Text>
      </TouchableOpacity>
      <Text style={styles.helpText}>
        Note: Default image is a burger with fries. Enter any direct image URL to test other foods.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    marginBottom: 8,
    color: Theme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    color: Theme.colors.text,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7', // Lighter green
  },
  text: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  helpText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 8,
  },
});

export default ApiTestButton;
