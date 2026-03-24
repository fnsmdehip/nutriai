import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { Theme } from '../../utils/theme';

const CONTENT_WIDTH = Dimensions.get('window').width - 40;

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLoader = ({
  width,
  height,
  borderRadius = 8,
  style,
}: SkeletonProps): React.JSX.Element => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: Theme.colors.surface,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const HomeSkeleton = (): React.JSX.Element => (
  <View style={skeletonStyles.container}>
    <View style={skeletonStyles.header}>
      <View>
        <SkeletonLoader width={160} height={28} borderRadius={6} />
        <SkeletonLoader width={120} height={16} borderRadius={4} style={{ marginTop: 8 }} />
      </View>
      <SkeletonLoader width={100} height={32} borderRadius={16} />
    </View>
    <SkeletonLoader
      width={CONTENT_WIDTH}
      height={160}
      borderRadius={16}
      style={{ alignSelf: 'center', marginTop: 16 }}
    />
    <SkeletonLoader
      width={CONTENT_WIDTH}
      height={140}
      borderRadius={16}
      style={{ alignSelf: 'center', marginTop: 16 }}
    />
    <View style={skeletonStyles.recentHeader}>
      <SkeletonLoader width={140} height={22} borderRadius={6} />
    </View>
    {[1, 2, 3].map(i => (
      <SkeletonLoader
        key={i}
        width={CONTENT_WIDTH}
        height={68}
        borderRadius={12}
        style={{ alignSelf: 'center', marginTop: 10 }}
      />
    ))}
  </View>
);

export const AnalyticsSkeleton = (): React.JSX.Element => (
  <View style={skeletonStyles.container}>
    <View style={skeletonStyles.analyticsHeader}>
      <SkeletonLoader width={120} height={28} borderRadius={6} />
      <SkeletonLoader width={60} height={28} borderRadius={14} />
    </View>
    <SkeletonLoader
      width={CONTENT_WIDTH}
      height={44}
      borderRadius={12}
      style={{ alignSelf: 'center', marginTop: 8 }}
    />
    <SkeletonLoader
      width={CONTENT_WIDTH}
      height={220}
      borderRadius={16}
      style={{ alignSelf: 'center', marginTop: 20 }}
    />
    <SkeletonLoader
      width={CONTENT_WIDTH}
      height={200}
      borderRadius={16}
      style={{ alignSelf: 'center', marginTop: 20 }}
    />
    <View style={skeletonStyles.statsRow}>
      <SkeletonLoader width={100} height={100} borderRadius={12} />
      <SkeletonLoader width={100} height={100} borderRadius={12} />
      <SkeletonLoader width={100} height={100} borderRadius={12} />
    </View>
  </View>
);

const skeletonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  recentHeader: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 4,
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
});
