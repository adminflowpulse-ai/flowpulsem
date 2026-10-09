'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { LanguageProvider } from './LanguageProvider';

const { wallets } = getDefaultWallets();

// Project ID WalletConnect/Reown: va impostato su Vercel come NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
// (creato su https://cloud.reown.com). Senza un ID valido WalletConnect e i wallet mobile non si collegano.
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';
if (typeof window !== 'undefined' && walletConnectProjectId === 'YOUR_PROJECT_ID') {
  console.error('[FlowPulseM] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID mancante: WalletConnect e wallet mobile non funzioneranno.');
}

const config = getDefaultConfig({
  appName: 'FlowPulseM',
  projectId: walletConnectProjectId,
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#1b61ff',
          accentColorForeground: 'white',
          borderRadius: 'large',
          fontStack: 'system',
          overlayBlur: 'small',
        })}>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}