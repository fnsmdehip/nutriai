import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import {
  GEMINI_PRO_API_ENDPOINT,
  GEMINI_FLASH_API_ENDPOINT,
  GEMINI_FLASH_LITE_API_ENDPOINT,
} from '@env';
import ApiTestButton from '../../components/common/ApiTestButton';
import ModelTextTester from '../../components/common/ModelTextTester';
import { Theme } from '../../utils/theme';
import aiService from '../../services/aiService';

const ApiTestScreen: React.FC = () => {
  // Function to test with the specific burger image the user shared
  const testWithBurgerImage = async () => {
    try {
      // Use the exact burger image shared in the chat
      // This is a direct image of a burger with fries that we received
      const burgerImageUrl = 'https://i.imgur.com/QGlL0Tr.jpg';

      // Alert to confirm starting the test
      alert('Analyzing the exact burger image you shared. This may take up to a minute...');

      // Call the recognizeFood function with the burger image
      const result = await aiService.recognizeFood(burgerImageUrl);

      // Create a detailed report
      let foodDetails = '';

      result.foods.forEach((food, index) => {
        foodDetails += `\n[Food ${index + 1}] ${food.name}\n`;
        foodDetails += `Calories: ${food.calories} kcal\n`;
        foodDetails += `Protein: ${food.protein}g\n`;
        foodDetails += `Carbs: ${food.carbs}g\n`;
        foodDetails += `Fat: ${food.fat}g\n`;
        foodDetails += `Portion: ${food.portion} ${food.unit}\n`;
      });

      // Display the result
      alert(`ANALYSIS RESULTS:
Model used: ${result.modelUsed}
Processing time: ${result.processingTime.toFixed(2)} seconds
Items recognized: ${result.foods.length}
${foodDetails}
`);
    } catch (error) {
      alert(`Analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Automatically run the burger test when the screen loads
  useEffect(() => {
    // Slight delay to ensure the screen is fully mounted
    const timer = setTimeout(() => {
      testWithBurgerImage();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Google AI API Test</Text>
        <Text style={styles.subtitle}>Environment Configuration</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API Endpoints:</Text>

          <View style={styles.endpointContainer}>
            <Text style={styles.endpointLabel}>Gemini 1.5 Pro:</Text>
            <Text style={styles.endpointValue} numberOfLines={2} ellipsizeMode="middle">
              {GEMINI_PRO_API_ENDPOINT || 'Not configured'}
            </Text>
          </View>

          <View style={styles.endpointContainer}>
            <Text style={styles.endpointLabel}>Gemini 1.5 Flash:</Text>
            <Text style={styles.endpointValue} numberOfLines={2} ellipsizeMode="middle">
              {GEMINI_FLASH_API_ENDPOINT || 'Not configured'}
            </Text>
          </View>

          <View style={styles.endpointContainer}>
            <Text style={styles.endpointLabel}>Gemini 1.0 Pro:</Text>
            <Text style={styles.endpointValue} numberOfLines={2} ellipsizeMode="middle">
              {GEMINI_FLASH_LITE_API_ENDPOINT || 'Not configured'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Test:</Text>
          <Text style={styles.description}>
            Analyze the burger and fries image you shared with us. This will use Google AI to
            identify the food and provide nutritional information.
          </Text>
          <TouchableOpacity style={styles.quickTestButton} onPress={testWithBurgerImage}>
            <Text style={styles.quickTestButtonText}>Analyze Your Burger Image</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Text Model Testing:</Text>
          <Text style={styles.description}>
            Test different Google AI models with text-only prompts. This helps verify model
            availability and compare response quality.
          </Text>
          <ModelTextTester style={styles.testerComponent} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food Recognition Test:</Text>
          <Text style={styles.description}>
            Click the button below to test the Google AI API for food recognition. This will verify
            if the API key is properly loaded and if the service is correctly configured.
          </Text>

          <ApiTestButton style={styles.testButton} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Implementation Notes:</Text>
          <Text style={styles.description}>
            • The API key is stored in the .env file (not committed to version control)
          </Text>
          <Text style={styles.description}>
            • We use a tiered approach with fallback between models
          </Text>
          <Text style={styles.description}>
            • Images are optimized before sending to reduce bandwidth
          </Text>
          <Text style={styles.description}>
            • Response parsing is handled to extract structured food data
          </Text>
          <Text style={styles.description}>
            • Supported models: Gemini 2.5 Pro, 2.0 Flash, 1.5 Flash-8B, 1.5 Pro, etc.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: Theme.colors.text,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
    backgroundColor: Theme.colors.card,
    padding: 16,
    borderRadius: 12,
    ...Theme.shadow.small,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: 16,
  },
  endpointContainer: {
    marginBottom: 12,
  },
  endpointLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  endpointValue: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 6,
  },
  description: {
    fontSize: 15,
    color: Theme.colors.textSecondary,
    marginBottom: 8,
    lineHeight: 22,
  },
  testButton: {
    marginTop: 16,
  },
  testerComponent: {
    marginTop: 16,
  },
  quickTestButton: {
    backgroundColor: '#FF9800', // Orange color to distinguish from other buttons
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  quickTestButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ApiTestScreen;
