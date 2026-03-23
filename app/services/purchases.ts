import { Platform } from 'react-native';
import Purchases, {
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';

const REVENUECAT_API_KEY = process.env.REVENUECAT_API_KEY ?? '';

const ENTITLEMENT_ID = 'premium';

export interface OfferingDetails {
  monthly: PurchasesPackage | null;
  yearly: PurchasesPackage | null;
  lifetime: PurchasesPackage | null;
}

/**
 * Initialize RevenueCat SDK. Call once at app startup.
 */
export async function initPurchases(): Promise<void> {
  try {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    if (Platform.OS === 'ios') {
      await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    } else if (Platform.OS === 'android') {
      await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    }
  } catch (error) {
    console.error('[Purchases] Failed to initialize RevenueCat:', error);
    throw error;
  }
}

/**
 * Fetch available offerings and return structured package references.
 */
export async function getOfferings(): Promise<OfferingDetails> {
  try {
    const offerings = await Purchases.getOfferings();
    const current: PurchasesOffering | null = offerings.current;

    if (!current) {
      console.warn('[Purchases] No current offering found');
      return { monthly: null, yearly: null, lifetime: null };
    }

    return {
      monthly: current.monthly ?? null,
      yearly: current.annual ?? null,
      lifetime: current.lifetime ?? null,
    };
  } catch (error) {
    console.error('[Purchases] Failed to get offerings:', error);
    throw error;
  }
}

/**
 * Purchase a specific package. Returns updated CustomerInfo.
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<CustomerInfo> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo;
  } catch (error: unknown) {
    const purchaseError = error as { userCancelled?: boolean; code?: number };
    if (purchaseError.userCancelled) {
      // User cancelled - not an error condition
      throw new PurchaseCancelledError();
    }
    console.error('[Purchases] Purchase failed:', error);
    throw error;
  }
}

/**
 * Restore previous purchases (for users who reinstall).
 */
export async function restorePurchases(): Promise<CustomerInfo> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.error('[Purchases] Restore failed:', error);
    throw error;
  }
}

/**
 * Check if the user has an active premium entitlement.
 */
export async function checkEntitlements(): Promise<{
  isPremium: boolean;
  expirationDate: string | null;
}> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];

    return {
      isPremium: entitlement !== undefined,
      expirationDate: entitlement?.expirationDate ?? null,
    };
  } catch (error) {
    console.error('[Purchases] Entitlement check failed:', error);
    return { isPremium: false, expirationDate: null };
  }
}

/**
 * Get the current customer info from RevenueCat.
 */
export async function getCustomerInfo(): Promise<CustomerInfo> {
  return Purchases.getCustomerInfo();
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
