/**
 * Web billing path.
 *
 * On the web there is no StoreKit / RevenueCat, so the "Verified" subscription
 * is sold through Stripe. The simplest correct integration that needs no
 * client-side secret is a Stripe Payment Link (or Checkout URL) — a public URL
 * that is safe to ship in the bundle, exactly like the QUEENEE / CallTwin
 * Stripe links already in use across HSW365.
 *
 * Configure these in the web build's environment (see .env.example):
 *   VITE_STRIPE_VERIFIED_LINK  — Stripe Payment Link for $9.99/mo "Verified"
 *   VITE_STRIPE_PORTAL_LINK    — Stripe billing-portal link (manage/cancel)
 *
 * When the link isn't set yet, purchasePlan throws a clear message instead of
 * silently doing nothing, so the paywall never looks broken in a demo.
 *
 * Granting the "verified" plan after payment is a backend concern (a Stripe
 * webhook that flips User.plan). Until that endpoint exists the checkout still
 * opens and completes; the account flips to verified on the next login once the
 * webhook is wired. That work is intentionally out of scope for the first web
 * cut and is tracked separately.
 */
const VERIFIED_LINK = import.meta.env.VITE_STRIPE_VERIFIED_LINK as string | undefined;
const PORTAL_LINK = import.meta.env.VITE_STRIPE_PORTAL_LINK as string | undefined;

function looksReal(url?: string): url is string {
  return typeof url === 'string' && /^https?:\/\//.test(url) && !url.includes('REPLACE_WITH');
}

/** No native SDK to configure on the web. */
export async function initPurchases(_appUserId?: string): Promise<void> {
  /* no-op */
}

/**
 * Sends the user to Stripe Checkout. This navigates the tab away, so the
 * caller's post-await code does not run — that's expected. We still return the
 * plan type for signature parity with the native implementation.
 */
export async function purchasePlan(_productId: string): Promise<'free' | 'verified'> {
  if (!looksReal(VERIFIED_LINK)) {
    throw new Error('Web checkout is not configured yet. Set VITE_STRIPE_VERIFIED_LINK.');
  }
  window.location.href = VERIFIED_LINK;
  return 'free';
}

/**
 * The web has no StoreKit "restore". If a billing-portal link is configured we
 * send the user there to manage/re-activate; otherwise we surface a message.
 */
export async function restorePurchases(): Promise<'free' | 'verified'> {
  if (looksReal(PORTAL_LINK)) {
    window.location.href = PORTAL_LINK;
    return 'free';
  }
  throw new Error('Manage your subscription from your account billing page.');
}

/** Convenience getters for platform-aware UI. */
export const checkoutUrl = (): string | undefined => (looksReal(VERIFIED_LINK) ? VERIFIED_LINK : undefined);
export const portalUrl = (): string | undefined => (looksReal(PORTAL_LINK) ? PORTAL_LINK : undefined);
