/**
 * In-app purchases service.
 *
 * Wraps RevenueCat SDK for subscription management.
 * In builds without native RevenueCat module, provides safe stubs
 * so the app can operate in free-tier mode.
 */

export interface OfferingDetails {
  monthly: unknown | null;
  yearly: unknown | null;
  lifetime: unknown | null;
}

export interface CustomerInfoResult {
  entitlements: {
    active: Record<string, { expirationDate: string | null } | undefined>;
  };
}

/**
 * Initialize RevenueCat SDK. Call once at app startup.
 */
export async function initPurchases(): Promise<void> {
  // In production, configure RevenueCat with the API key:
  // await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
}

/**
 * Fetch available offerings.
 */
export async function getOfferings(): Promise<OfferingDetails> {
  return { monthly: null, yearly: null, lifetime: null };
}

/**
 * Purchase a package. Returns updated customer info.
 */
export async function purchasePackage(_pkg: unknown): Promise<CustomerInfoResult> {
  throw new PurchaseCancelledError();
}

/**
 * Restore previous purchases.
 */
export async function restorePurchases(): Promise<CustomerInfoResult> {
  return {
    entitlements: { active: {} },
  };
}

/**
 * Check if the user has an active premium entitlement.
 */
export async function checkEntitlements(): Promise<{
  isPremium: boolean;
  expirationDate: string | null;
}> {
  return { isPremium: false, expirationDate: null };
}

/**
 * Custom error for user-cancelled purchases.
 */
export class PurchaseCancelledError extends Error {
  constructor() {
    super('Purchase was cancelled by the user');
    this.name = 'PurchaseCancelledError';
  }
}
