/**
 * Platform-agnostic purchases facade.
 *
 * The two implementations are loaded *dynamically* so the native RevenueCat
 * plugin (`purchases.native.ts`) is code-split into its own chunk and never
 * executed — or even loaded — in a browser. The web build ships only the tiny
 * Stripe redirect path (`purchases.web.ts`).
 *
 * Public surface is intentionally minimal: exactly what the UI calls.
 */
import { isNative } from './platform';

async function impl() {
  return isNative() ? import('./purchases.native') : import('./purchases.web');
}

export async function initPurchases(appUserId?: string): Promise<void> {
  const m = await impl();
  await m.initPurchases(appUserId);
}

export async function purchasePlan(productId: string): Promise<'free' | 'verified'> {
  const m = await impl();
  return m.purchasePlan(productId);
}

export async function restorePurchases(): Promise<'free' | 'verified'> {
  const m = await impl();
  return m.restorePurchases();
}
