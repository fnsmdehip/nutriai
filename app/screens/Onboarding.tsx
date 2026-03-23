import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { completeOnboarding, setGender, setGoal, setHeight, setWeight } from '../store/userSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type OnboardingProps = {
  navigation: NativeStackNavigationProp<any, any>;
};

const OnboardingScreen = ({ navigation }: OnboardingProps) => {
  const [step, setStep] = useState(0);
  const [userInfo, setUserInfo] = useState({
    gender: '',
    workoutFrequency: '',
    height: '',
    weight: '',
    birthdate: '',
    goal: '',
    dietType: '',
    obstacles: [],
    aims: []
  });

  const dispatch = useDispatch();

  // Mock completion for demo purposes
  const handleContinue = () => {
    if (step < 8) {
      setStep(step + 1);
    } else {
      // Save user info to Redux
      dispatch(setGender(userInfo.gender as 'male' | 'female' | 'other'));
      dispatch(setHeight(Number(userInfo.height)));
      dispatch(setWeight(Number(userInfo.weight)));
      dispatch(setGoal(userInfo.goal as 'lose' | 'maintain' | 'gain'));
      dispatch(completeOnboarding());
      
      // Navigate to main app
      navigation.replace('Main');
    }
  };

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <View style={styles.welcomeContainer}>
            <View style={styles.mockPhoneFrame}>
              <View style={styles.mockAppPreview}>
                <Text style={styles.mockCalorieText}>2199</Text>
                <Text style={styles.mockSubtitle}>Calories left</Text>
                <View style={styles.mockMacros}>
                  <View style={styles.mockMacroItem}>
                    <Text style={styles.mockMacroValue}>161g</Text>
                    <Text style={styles.mockMacroLabel}>Protein</Text>
                  </View>
                  <View style={styles.mockMacroItem}>
                    <Text style={styles.mockMacroValue}>207g</Text>
                    <Text style={styles.mockMacroLabel}>Carbs</Text>
                  </View>
                  <View style={styles.mockMacroItem}>
                    <Text style={styles.mockMacroValue}>73g</Text>
                    <Text style={styles.mockMacroLabel}>Fat</Text>
                  </View>
                </View>
              </View>
            </View>
            <Text style={styles.title}>Calorie tracking made easy</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.textLink}>
              <Text style={styles.linkText}>Purchased on the web? Sign In</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(step) * 12.5}%` }]} />
            </View>
            <Text style={styles.stepTitle}>
              {`Step ${step} of 8: ${["Gender", "Workout Frequency", "How You Found Us", 
                "Height & Weight", "Birthdate", "Goal", "Diet Type", "Obstacles"][step-1]}`}
            </Text>
            <Text style={styles.stepDescription}>
              Let's set up your profile to give you the best experience
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderStep()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingTop: 40,
  },
  mockPhoneFrame: {
    width: 280,
    height: 500,
    backgroundColor: '#f5f5f5',
    borderRadius: 30,
    marginBottom: 30,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  mockAppPreview: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockCalorieText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mockSubtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  mockMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  mockMacroItem: {
    alignItems: 'center',
  },
  mockMacroValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  mockMacroLabel: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textLink: {
    marginTop: 10,
  },
  linkText: {
    color: '#000',
    textDecorationLine: 'underline',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 30,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 4,
  },
});

export default OnboardingScreen; 