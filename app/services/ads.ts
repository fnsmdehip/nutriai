/**
 * Ad service abstraction.
 *
 * In production, this integrates with react-native-google-mobile-ads.
 * For the build to succeed without native module configuration,
 * the service is implemented as a safe no-op layer that can be
 * swapped in when the native ad SDK is properly linked.
 */

let interstitialReady = false;
let rewardedReady = false;

/**
 * Load an interstitial ad. No-op until native module is configured.
 */
export function loadInterstitialAd(): void {
  // Will be loaded via react-native-google-mobile-ads in production build
  interstitialReady = false;
}

/**
 * Show the interstitial ad if loaded.
 */
export function showInterstitialAd(): boolean {
  if (interstitialReady) {
    interstitialReady = false;
    return true;
  }
  return false;
}

/**
 * Check if an interstitial ad is ready.
 */
export function isInterstitialReady(): boolean {
  return interstitialReady;
}

/**
 * Load a rewarded ad.
 */
export function loadRewardedAd(): void {
  rewardedReady = false;
}

/**
 * Show a rewarded ad. Resolves to true if the reward was earned.
 */
export function showRewardedAd(): Promise<boolean> {
  return Promise.resolve(false);
}

/**
 * Check if a rewarded ad is ready.
 */
export function isRewardedReady(): boolean {
  return rewardedReady;
}

/**
 * Pre-load all ad types. Called at app startup for free users.
 */
export function preloadAllAds(): void {
  loadInterstitialAd();
  loadRewardedAd();
}

/**
 * Determine if an interstitial should be shown based on scan count.
 * Shows after every 5th food scan for free users.
 */
export function shouldShowInterstitial(totalScans: number): boolean {
  return totalScans > 0 && totalScans % 5 === 0;
}
