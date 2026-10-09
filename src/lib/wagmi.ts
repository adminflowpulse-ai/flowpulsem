import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  polygon,
  polygonAmoy,
  mainnet,
  arbitrum,
  optimism,
  base,
  sepolia,
} from 'wagmi/chains';
import { http, fallback } from 'wagmi';

// WalletConnect v2 / Reown Project ID:
// Usa la variabile d'ambiente NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID se valida,
// altrimenti ricade sull'ID pubblico ufficiale di default di RainbowKit
// per garantire che il popup di connessione e i wallet non vadano mai in errore 401/403.
const envProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim();
export const WALLETCONNECT_PROJECT_ID =
  envProjectId && envProjectId !== 'YOUR_PROJECT_ID'
    ? envProjectId
    : 'b56e18d47c72ab683b10817156fc74f4';

export const config = getDefaultConfig({
  appName: 'FlowPulseM',
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [
    polygon,
    polygonAmoy,
    mainnet,
    arbitrum,
    optimism,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  transports: {
    [polygon.id]: fallback([
      http('https://polygon.drpc.org'),
      http('https://polygon-bor-rpc.publicnode.com'),
      http('https://1rpc.io/matic'),
      http(),
    ]),
    [polygonAmoy.id]: fallback([
      http('https://polygon-amoy.drpc.org'),
      http('https://polygon-amoy-bor-rpc.publicnode.com'),
      http(),
    ]),
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
});
