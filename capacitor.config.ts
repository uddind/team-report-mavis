import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.MRS',
  appName: 'MRS',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;