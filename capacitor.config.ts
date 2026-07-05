import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mavis.teamreport',
  appName: 'TeamReport Mavis',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;