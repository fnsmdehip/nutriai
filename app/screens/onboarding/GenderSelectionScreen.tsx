import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import Button from '../../components/common/Button';
import OnboardingHeader from '../../components/onboarding/OnboardingHeader';
import SelectionOption from '../../components/onboarding/SelectionOption';
import { Theme } from '../../utils/theme';
import { setGender, advanceOnboardingStep } from '../../store/userSlice';

type GenderSelectionScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  'GenderSelection'
>;

const GenderSelectionScreen = () => {
  const navigation = useNavigation<GenderSelectionScreenNavigationProp>();
  const dispatch = useDispatch();
  const [selectedGender, setSelectedGender] = React.useState<'male' | 'female' | 'other' | null>(null);

  const handleContinue = () => {
    if (selectedGender) {
      dispatch(setGender(selectedGender));
      dispatch(advanceOnboardingStep());
      navigation.navigate('WorkoutFrequency');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader
        currentStep={1}
        totalSteps={10}
        showBackButton={false}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>What's your gender?</Text>
        
        <View style={styles.optionsContainer}>
          <SelectionOption
            label="Male"
            isSelected={selectedGender === 'male'}
            onSelect={() => setSelectedGender('male')}
          />
          
          <SelectionOption
            label="Female"
            isSelected={selectedGender === 'female'}
            onSelect={() => setSelectedGender('female')}
          />
          
          <SelectionOption
            label="Other"
            isSelected={selectedGender === 'other'}
            onSelect={() => setSelectedGender('other')}
          />
        </View>
      </View>
      
      <View style={styles.bottomContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedGender}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.spacing.l,
    paddingTop: Theme.spacing.xl,
  },
  title: {
    fontSize: Theme.typography.fontSize.xxlarge,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xl,
  },
  optionsContainer: {
    marginTop: Theme.spacing.l,
  },
  bottomContainer: {
    padding: Theme.spacing.l,
    paddingBottom: Theme.spacing.xl,
  },
});

export default GenderSelectionScreen; 