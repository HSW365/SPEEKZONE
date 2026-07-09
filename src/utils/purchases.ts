import { Capacitor } from '@capacitor/core';
import { Purchases, LOG_LEVEL, type CustomerInfo } from '@revenuecat/purchases-capacitor';

/**
 * RevenueCat wraps Apple's StoreKit so we're compliant with Guideline 3.1.1
 * (no external payment processors for digital subscriptions inside the app).
 *
 * Two things must exist before this actually works, and can't be done from
 * code — they're dashboard/account setup, not engineering:
 *
 *   1. App Store Connect → the two auto-renewable subscriptions must be
 *      created with these exact product IDs (already referenced in
 *      src/utils/data.ts):
 *        com.speekzone.app.creator_monthly   ($9.99/mo)
 *        com.speekzone.app.pro_monthly       ($24.99/mo)
 *      Apple requires an active Paid Apps Agreement + banking/tax info
 *      before subscriptions can go live, even in sandbox testing on device.
 *
 *   2. RevenueCat dashboard (app.revenuecat.com) → create a project, add the
 *      iOS app (bundle id com.speekzone.app), attach the App Store Connect
 *      API key so RevenueCat can validate receipts, then create an
 *      entitlement called "premium" attached to both products above, and
 *      copy the public iOS SDK key into REVENUECAT_IOS_API_KEY below.
 *
 * The public SDK key is meant to ship in client code (RevenueCat's own
 * design) — it can't authorize refunds/payouts, so it isn't a secret like a
 * Stripe key would be.
 */
const REVENUECAT_IOS_API_KEY = 'REPLACE_WITH_REVENUECAT_PUBLIC_IOS_KEY';

const ENTITLEMENT_ID = 'premium';

let configured = false;

export async function initPurchases(appUserId?: string) {
  if (!Capacitor.isNativePlatform()) return; // no-op on web/dev preview
  if (configured) return;

  if (!REVENUECAT_IOS_API_KEY || REVENUECAT_IOS_API_KEY.startsWith('REPLACE_WITH')) {
    console.warn('[purchases] RevenueCat API key not set — purchases are disabled until it is.');
    return;
  }

  await Purchases.configure({ apiKey: REVENUECAT_IOS_API_KEY, appUserID: appUserId });
  await Purchases.setLogLevel({ level: LOG_LEVEL.WARN });
  configured = true;
}

/** Maps a RevenueCat CustomerInfo to our local plan model. */
function planFromCustomerInfo(info: CustomerInfo): 'free' | 'creator' | 'pro' {
  const active = info.entitlements.active[ENTITLEMENT_ID];
  if (!active) return 'free';
  // Both products map to the same entitlement, so read back which product granted it.
  if (active.productIdentifier === 'com.speekzone.app.pro_monthly') return 'pro';
  if (active.productIdentifier === 'com.speekzone.app.creator_monthly') return 'creator';
  return 'free';
}

export async function getCurrentPlan(): Promise<'free' | 'creator' | 'pro' | null> {
  if (!configured) return null;
  const { customerInfo } = await Purchases.getCustomerInfo();
  return planFromCustomerInfo(customerInfo);
}

/** Fetches the current offering's packages, keyed by our plan ids. */
export async function getAvailablePackages() {
  if (!configured) return null;
  const offerings = await Purchases.getOfferings();
  const current = offerings.current;
  if (!current) return null;
  return current.availablePackages;
}

/**
 * Purchases a plan by Apple product id. Returns the resulting plan on
 * success, throws on failure (including user cancellation — caller should
 * catch and simply not show an error toast for that case).
 */
export async function purchasePlan(appleProductId: string): Promise<'free' | 'creator' | 'pro'> {
  if (!configured) {
    throw new Error('Purchases not configured. Set REVENUECAT_IOS_API_KEY in src/utils/purchases.ts.');
  }

  const packages = await getAvailablePackages();
  const pkg = packages?.find(p => p.product.identifier === appleProductId);

  if (!pkg) {
    // This means the product isn't attached to RevenueCat's "current" offering
    // for this app — a dashboard config issue, not a code issue. Fix at
    // app.revenuecat.com → Offerings → attach the package to this product.
    throw new Error(`"${appleProductId}" isn't attached to the current RevenueCat offering.`);
  }

  const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
  return planFromCustomerInfo(customerInfo);
}

export async function restorePurchases(): Promise<'free' | 'creator' | 'pro'> {
  if (!configured) {
    throw new Error('Purchases not configured. Set REVENUECAT_IOS_API_KEY in src/utils/purchases.ts.');
  }
  const { customerInfo } = await Purchases.restorePurchases();
  return planFromCustomerInfo(customerInfo);
}
