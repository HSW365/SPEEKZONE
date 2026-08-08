import { Capacitor } from '@capacitor/core';

/**
 * Single source of truth for "am I running inside the native iOS shell or in a
 * plain browser?". Capacitor's own check works in both builds — on the web it
 * simply returns false — so we can key every platform branch off this without
 * pulling any native plugin into the web bundle.
 */
export const isNative = (): boolean => Capacitor.isNativePlatform();
export const isWeb = (): boolean => !isNative();
