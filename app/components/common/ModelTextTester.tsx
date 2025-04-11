import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import aiService from '../../services/aiService';
import { GOOGLE_AI_API_KEY } from '@env';
import { Theme } from '../../utils/theme';

interface ModelTextTesterProps {
  style?: object;
}

const ModelTextTester: React.FC<ModelTextTesterProps> = ({ style }) => {
  const [prompt, setPrompt] = useState(
    'Analyze this burger and fries meal for nutritional content. How many calories, proteins, carbs and fats would it contain?',
  );
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [result, setResult] = useState('');

  const testModels = [
    { value: '', label: 'All models (with fallback)' },
    { value: 'Gemini 2.5 Pro', label: 'Gemini 2.5 Pro' },
    { value: 'Gemini 2.0 Flash', label: 'Gemini 2.0 Flash' },
    { value: 'Gemini 2.0 Flash-Lite', label: 'Gemini 2.0 Flash-Lite' },
    { value: 'Gemini 1.5 Flash-8B', label: 'Gemini 1.5 Flash-8B' },
    { value: 'Gemini 1.5 Pro', label: 'Gemini 1.5 Pro' },
    { value: 'Gemini 1.5 Flash', label: 'Gemini 1.5 Flash' },
    { value: 'Gemini 1.0 Pro', label: 'Gemini 1.0 Pro' },
  ];

  const testModelText = async () => {
    try {
      // Check if the API key is loaded
      if (!GOOGLE_AI_API_KEY) {
        Alert.alert(
          'API Key Missing',
          'The Google AI API key is not loaded from environment variables',
        );
        return;
      }

      setLoading(true);
      setResult('Testing, please wait...');

      alert(
        `Testing ${selectedModel || 'all models with fallback'}. This may take a few moments...`,
      );

      const modelResult = await aiService.testModelWithText(prompt, selectedModel || undefined);

      setResult(
        `Model: ${modelResult.modelUsed}\nTime: ${modelResult.processingTime.toFixed(2)}s\n\nResponse:\n${modelResult.text}`,
      );
    } catch (error) {
      Alert.alert(
        'API Test Failed',
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      setResult(`Test failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Test prompt:</Text>
      <TextInput
        style={styles.input}
        value={prompt}
        onChangeText={setPrompt}
        multiline
        numberOfLines={3}
        placeholder="Enter a prompt to test the models"
      />

      <Text style={styles.label}>Select model:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedModel}
          onValueChange={(itemValue: string) => setSelectedModel(itemValue)}
          style={styles.picker}
        >
          {testModels.map(model => (
            <Picker.Item key={model.value} label={model.label} value={model.value} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={testModelText} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Test Google AI Models</Text>
        )}
      </TouchableOpacity>

      {result ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Result:</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    ...Theme.shadow.small,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  resultContainer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: Theme.colors.text,
  },
  resultText: {
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 6,
    color: Theme.colors.text,
  },
});

export default ModelTextTester;
