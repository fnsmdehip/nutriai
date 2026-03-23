import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useAppSelector } from '../../store/hooks';

const IS_DEV = __DEV__;
const BANNER_AD_UNIT = IS_DEV ? TestIds.BANNER : 'ca-app-pub-5277873663568466/BANNER_ID';

interface BannerAdViewProps {
  /**
   * Optional style override for the container.
   */
  containerStyle?: object;
}

/**
 * Banner ad component that only renders for free-tier users.
 * Hides automatically when the user has an active premium subscription.
 */
const BannerAdView: React.FC<BannerAdViewProps> = ({ containerStyle }) => {
  const isPremium = useAppSelector((state) => state.subscription.isPremium);

  // Don't show ads to premium subscribers
  if (isPremium) {
    return null;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <BannerAd
        unitId={BANNER_AD_UNIT}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error) => {
          console.warn('[BannerAd] Failed to load:', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
});

export default BannerAdView;
