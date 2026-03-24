import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useAppSelector } from '../../store/hooks';

interface BannerAdViewProps {
  containerStyle?: ViewStyle;
}

/**
 * Banner ad placeholder that only renders for free-tier users.
 * In production, integrate react-native-google-mobile-ads BannerAd here.
 */
const BannerAdView: React.FC<BannerAdViewProps> = ({ containerStyle }) => {
  const isPremium = useAppSelector((state) => state.subscription.isPremium);

  if (isPremium) {
    return null;
  }

  // Ad placeholder - in production, render BannerAd component from
  // react-native-google-mobile-ads with proper ad unit IDs.
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.adPlaceholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  adPlaceholder: {
    width: '100%',
    height: 0,
  },
});

export default BannerAdView;
