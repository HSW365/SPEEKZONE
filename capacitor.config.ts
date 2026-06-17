import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.speekzone.app',
  appName: 'SpeekZone',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  ios: {
    // 'never' — the app already pads every screen manually via env(safe-area-inset-*)
    // in CSS. Leaving this as 'always' double-insets content on iPad's safe-area
    // geometry, which can desync the rendered layout from the native touch
    // hit-testing frame (buttons render in place but stop receiving taps).
    contentInset: 'never',
    backgroundColor: '#0a1628',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0a1628',
      showSpinner: false,
    },
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#0a1628',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
