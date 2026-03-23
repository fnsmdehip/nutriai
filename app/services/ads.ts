import {
  InterstitialAd,
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
  TestIds,
  BannerAdSize,
} from 'react-native-google-mobile-ads';

// Use test IDs in development, real IDs in production
const IS_DEV = __DEV__;

// Ad unit IDs - replace with your real ad unit IDs from AdMob console
// These are configured per-platform in AdMob dashboard
const AD_UNITS = {
  banner: IS_DEV ? TestIds.BANNER : 'ca-app-pub-5277873663568466/BANNER_ID',
  interstitial: IS_DEV
    ? TestIds.INTERSTITIAL
    : 'ca-app-pub-5277873663568466/INTERSTITIAL_ID',
  rewarded: IS_DEV
    ? TestIds.REWARDED
    : 'ca-app-pub-5277873663568466/REWARDED_ID',
} as const;

// Interstitial ad singleton
let interstitialAd: InterstitialAd | null = null;
let isInterstitialLoaded = false;

// Rewarded ad singleton
let rewardedAd: RewardedAd | null = null;
let isRewardedLoaded = false;

/**
 * Load an interstitial ad. Should be called ahead of time so the ad is ready when needed.
 */
export function loadInterstitialAd(): void {
  try {
    interstitialAd = InterstitialAd.createForAdRequest(AD_UNITS.interstitial);

    const unsubscribeLoaded = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        isInterstitialLoaded = true;
      }
    );

    const unsubscribeClosed = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        isInterstitialLoaded = false;
        // Pre-load the next interstitial
        loadInterstitialAd();
      }
    );

    const unsubscribeError = interstitialAd.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.warn('[Ads] Interstitial ad error:', error);
        isInterstitialLoaded = false;
      }
    );

    interstitialAd.load();
  } catch (error) {
    console.error('[Ads] Failed to load interstitial:', error);
  }
}

/**
 * Show the interstitial ad if loaded. Returns true if shown.
 */
export function showInterstitialAd(): boolean {
  if (interstitialAd && isInterstitialLoaded) {
    interstitialAd.show();
    isInterstitialLoaded = false;
    return true;
  }
  return false;
}

/**
 * Check if an interstitial ad is ready to show.
 */
export function isInterstitialReady(): boolean {
  return isInterstitialLoaded;
}

/**
 * Load a rewarded ad. Should be called ahead of time.
 */
export function loadRewardedAd(): void {
  try {
    rewardedAd = RewardedAd.createForAdRequest(AD_UNITS.rewarded);

    const unsubscribeLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        isRewardedLoaded = true;
      }
    );

    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        // Reward is handled by the caller via the promise
      }
    );

    const unsubscribeClosed = rewardedAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        isRewardedLoaded = false;
        loadRewardedAd();
      }
    );

    const unsubscribeError = rewardedAd.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.warn('[Ads] Rewarded ad error:', error);
        isRewardedLoaded = false;
      }
    );

    rewardedAd.load();
  } catch (error) {
    console.error('[Ads] Failed to load rewarded ad:', error);
  }
}

/**
 * Show a rewarded ad. Returns a promise that resolves to true if the user
 * earned the reward, false if they cancelled or it failed.
 */
export function showRewardedAd(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!rewardedAd || !isRewardedLoaded) {
      resolve(false);
      return;
    }

    let rewarded = false;

    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        rewarded = true;
      }
    );

    const unsubscribeClosed = rewardedAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        unsubscribeEarned();
        unsubscribeClosed();
        resolve(rewarded);
        isRewardedLoaded = false;
        loadRewardedAd();
      }
    );

    rewardedAd.show();
    isRewardedLoaded = false;
  });
}

/**
 * Check if a rewarded ad is ready to show.
 */
export function isRewardedReady(): boolean {
  return isRewardedLoaded;
}

/**
 * Pre-load all ad types. Call at app startup for free users.
 */
export function preloadAllAds(): void {
  loadInterstitialAd();
  loadRewardedAd();
}

/**
 * Exported constants for banner ad configuration.
 */
export const BannerConfig = {
  unitId: AD_UNITS.banner,
  size: BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
} as const;

/**
 * Determine if an interstitial should be shown based on scan count.
 * Shows after every 5th food scan for free users.
 */
export function shouldShowInterstitial(totalScans: number): boolean {
  return totalScans > 0 && totalScans % 5 === 0;
}
