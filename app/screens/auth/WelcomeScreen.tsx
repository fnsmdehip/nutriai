import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import Button from '../../components/common/Button';
import { Theme } from '../../utils/theme';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* App Dashboard Preview */}
        <View style={styles.previewContainer}>
          <View style={styles.dashboardPreview}>
            {/* Today/Yesterday Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity style={styles.toggleButtonActive}>
                <Text style={styles.toggleTextActive}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toggleButtonInactive}>
                <Text style={styles.toggleTextInactive}>Yesterday</Text>
              </TouchableOpacity>
            </View>
            
            {/* Calorie Display */}
            <View style={styles.calorieContainer}>
              <Text style={styles.calorieNumber}>2199</Text>
              <Text style={styles.calorieLabel}>Calories left</Text>
            </View>
            
            {/* Macro Tracking */}
            <View style={styles.macroContainer}>
              <View style={styles.macroCard}>
                <Text style={styles.macroTitle}>Protein</Text>
                <Text style={[styles.macroValue, { color: Theme.colors.protein }]}>161g</Text>
                <View style={[styles.macroProgress, { backgroundColor: Theme.colors.protein }]} />
              </View>
              <View style={styles.macroCard}>
                <Text style={styles.macroTitle}>Carbs</Text>
                <Text style={[styles.macroValue, { color: Theme.colors.carbs }]}>186g</Text>
                <View style={[styles.macroProgress, { backgroundColor: Theme.colors.carbs }]} />
              </View>
              <View style={styles.macroCard}>
                <Text style={styles.macroTitle}>Fat</Text>
                <Text style={[styles.macroValue, { color: Theme.colors.fat }]}>73g</Text>
                <View style={[styles.macroProgress, { backgroundColor: Theme.colors.fat }]} />
              </View>
            </View>
          </View>
        </View>
        
        {/* App Name and Tagline */}
        <View style={styles.infoContainer}>
          <Text style={styles.appName}>Nutri AI</Text>
          <Text style={styles.tagline}>Calorie tracking made easy</Text>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('SignUp')}
            variant="primary"
          />
          
          <TouchableOpacity
            style={styles.signInLink}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.signInText}>
              Purchased on the web? <Text style={styles.signInHighlight}>Sign In</Text>
            </Text>
          </TouchableOpacity>
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
    flexGrow: 1,
    paddingHorizontal: Theme.spacing.l,
    paddingVertical: Theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: Theme.spacing.xl,
  },
  dashboardPreview: {
    width: '90%',
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.border.radius.large,
    padding: Theme.spacing.l,
    ...Theme.shadow.medium,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.large,
    marginBottom: Theme.spacing.l,
    padding: 4,
  },
  toggleButtonActive: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.border.radius.medium,
    paddingVertical: Theme.spacing.xs,
    alignItems: 'center',
  },
  toggleButtonInactive: {
    flex: 1,
    paddingVertical: Theme.spacing.xs,
    alignItems: 'center',
  },
  toggleTextActive: {
    color: Theme.colors.text,
    fontWeight: '600',
    fontSize: Theme.typography.fontSize.medium,
  },
  toggleTextInactive: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.typography.fontSize.medium,
  },
  calorieContainer: {
    alignItems: 'center',
    marginVertical: Theme.spacing.l,
  },
  calorieNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  calorieLabel: {
    fontSize: Theme.typography.fontSize.medium,
    color: Theme.colors.textSecondary,
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroCard: {
    flex: 1,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.medium,
    padding: Theme.spacing.m,
    marginHorizontal: Theme.spacing.xs,
    alignItems: 'center',
  },
  macroTitle: {
    fontSize: Theme.typography.fontSize.small,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  macroValue: {
    fontSize: Theme.typography.fontSize.large,
    fontWeight: '600',
    marginBottom: Theme.spacing.s,
  },
  macroProgress: {
    height: 4,
    width: '80%',
    borderRadius: 2,
  },
  infoContainer: {
    alignItems: 'center',
    marginVertical: Theme.spacing.xl,
  },
  appName: {
    fontSize: Theme.typography.fontSize.xxlarge,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.s,
  },
  tagline: {
    fontSize: Theme.typography.fontSize.large,
    color: Theme.colors.textSecondary,
  },
  actionContainer: {
    width: '100%',
    marginTop: Theme.spacing.l,
  },
  signInLink: {
    marginTop: Theme.spacing.xl,
    alignItems: 'center',
  },
  signInText: {
    fontSize: Theme.typography.fontSize.medium,
    color: Theme.colors.text,
  },
  signInHighlight: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
});

export default WelcomeScreen; 