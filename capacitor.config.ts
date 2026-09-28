import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.flowpulsem.app',
  appName: 'FlowPulseM',
  webDir: 'out',
  server: {
    url: 'https://web-app-self-iota-54.vercel.app',
    cleartext: true
  }
};

export default config;