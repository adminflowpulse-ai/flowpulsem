"use client";

import * as React from 'react';
import {
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { config } from '@/lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';
import { SessionProvider } from 'next-auth/react';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#8a2be2',
          accentColorForeground: 'white',
          borderRadius: 'medium',
        })}>
          <SessionProvider>
            {children}
          </SessionProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
