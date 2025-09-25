import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'LYNK',
  slug: 'lynk',
  scheme: 'lynk',
  orientation: 'portrait',
  plugins: ['react-native-reanimated', ['expo-build-properties', { ios: { useFrameworks: 'static' } }]],
  ios: { supportsTablet: true },
  android: { adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#ffffff' } },
  extra: {
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY ?? '',
      authDomain: process.env.FIREBASE_AUTH_DOMAIN ?? '',
      projectId: process.env.FIREBASE_PROJECT_ID ?? '',
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? '',
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? '',
      appId: process.env.FIREBASE_APP_ID ?? '',
      measurementId: process.env.FIREBASE_MEASUREMENT_ID ?? ''
    },
    google: {
      iosClientId: process.env.GOOGLE_IOS_CLIENT_ID ?? '',
      androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID ?? '',
      webClientId: process.env.GOOGLE_WEB_CLIENT_ID ?? ''
    }
  }
};

export default config;
