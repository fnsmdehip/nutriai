import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { HomeStackParamList } from '../../navigation/MainNavigator';
import { startTrial } from '../../store/subscriptionSlice';
import Button from '../../components/common/Button';
import { Theme } from '../../utils/theme';

type TrialOfferScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'TrialOffer'
>;

const TrialOfferScreen = () => {
  const navigation = useNavigation<TrialOfferScreenNavigationProp>();
  const dispatch = useDispatch();

  const handleStartTrial = () => {
    dispatch(startTrial());
    navigation.navigate('Subscription');
  };

  const handleDismiss = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={handleDismiss}>
        <View style={styles.closeIcon}>
          <View style={styles.closeIconLine1} />
          <View style={styles.closeIconLine2} />
        </View>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Dashboard Preview Image */}
        <View style={styles.imageContainer}>
          <View style={styles.previewCard}>
            <View style={styles.cameraPreview}>
              <Image
                source={require('../../assets/camera-preview.png')}
                style={styles.previewImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Offer Content */}
        <View style={styles.offerContainer}>
          <Text style={styles.offerTitle}>
            We want you to try Nutri AI for free
          </Text>

          <View style={styles.noPaymentContainer}>
            <View style={styles.checkmarkCircle}>
              <View style={styles.checkmark} />
            </View>
            <Text style={styles.noPaymentText}>No Payment Due Now</Text>
          </View>

          <Button
            title="Try for $0.00"
            onPress={handleStartTrial}
            variant="primary"
            size="large"
            containerStyle={styles.trialButton}
          />

          <Text style={styles.priceText}>
            Just $29.99 per year ($2.49/mo)
          </Text>
        </View>

        {/* Restore Link */}
        <TouchableOpacity
          style={styles.restoreContainer}
          onPress={() => navigation.navigate('Subscription')}
        >
          <Text style={styles.restoreText}>Restore</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeIcon: {
    width: 14,
    height: 14,
    position: 'relative',
  },
  closeIconLine1: {
    position: 'absolute',
    top: 6,
    left: 0,
    width: 14,
    height: 2,
    backgroundColor: Theme.colors.text,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  closeIconLine2: {
    position: 'absolute',
    top: 6,
    left: 0,
    width: 14,
    height: 2,
    backgroundColor: Theme.colors.text,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
  },
  contentContainer: {
    padding: Theme.spacing.l,
    paddingTop: Theme.spacing.xxl,
    alignItems: 'center',
  },
  imageContainer: {
    marginVertical: Theme.spacing.xl,
    alignItems: 'center',
    width: '100%',
  },
  previewCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.border.radius.large,
    padding: Theme.spacing.m,
    width: '90%',
    aspectRatio: 0.75,
    ...Theme.shadow.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraPreview: {
    width: '100%',
    height: '100%',
    borderRadius: Theme.border.radius.medium,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  offerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  offerTitle: {
    fontSize: Theme.typography.fontSize.xlarge,
    fontWeight: '700',
    color: Theme.colors.text,
    textAlign: 'center',
    marginBottom: Theme.spacing.l,
  },
  noPaymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.l,
  },
  checkmarkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.s,
  },
  checkmark: {
    width: 10,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
  },
  noPaymentText: {
    fontSize: Theme.typography.fontSize.medium,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  trialButton: {
    width: '100%',
    marginBottom: Theme.spacing.m,
  },
  priceText: {
    fontSize: Theme.typography.fontSize.medium,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xl,
  },
  restoreContainer: {
    marginTop: Theme.spacing.xxl,
  },
  restoreText: {
    fontSize: Theme.typography.fontSize.medium,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
});

export default TrialOfferScreen; 