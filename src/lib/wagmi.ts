import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  rainbowWallet,
  trustWallet,
  okxWallet,
  walletConnectWallet,
  rabbyWallet,
  phantomWallet,
  zerionWallet,
  bitgetWallet,
  safeWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  polygon,
  polygonAmoy,
  mainnet,
  arbitrum,
  optimism,
  base,
  sepolia,
} from 'wagmi/chains';
import { http, fallback, createConnector } from 'wagmi';
import { injected } from 'wagmi/connectors';

// WalletConnect v2 / Reown Project ID:
// Usa la variabile d'ambiente NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID se valida,
// altrimenti ricade sull'ID pubblico ufficiale di default di RainbowKit
const envProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim();
export const WALLETCONNECT_PROJECT_ID =
  envProjectId && envProjectId !== 'YOUR_PROJECT_ID'
    ? envProjectId
    : 'b56e18d47c72ab683b10817156fc74f4';

// Custom MetaMask wallet wrapper:
// Risolve il problema del fallimento di rilevamento MetaMask durante SSR / caricamento del modulo,
// collegando direttamente window.ethereum.request({ method: 'eth_requestAccounts' })
// per garantire l'apertura immediata del popup dell'estensione.
const customMetaMaskWallet = ({ projectId }: { projectId: string }) => {
  const defaultWallet = metaMaskWallet({ projectId });
  return {
    ...defaultWallet,
    installed: typeof window !== 'undefined' ? Boolean((window as any).ethereum) : true,
    createConnector: (walletDetails: any) => {
      return createConnector((config) => {
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          const injectedConnector = injected({ target: 'metaMask' })(config);
          return {
            ...injectedConnector,
            ...walletDetails,
          };
        }
        return defaultWallet.createConnector(walletDetails)(config);
      });
    },
  };
};

export const config = getDefaultConfig({
  appName: 'FlowPulseM',
  projectId: WALLETCONNECT_PROJECT_ID,
  wallets: [
    {
      groupName: 'Popolari su Polygon',
      wallets: [
        customMetaMaskWallet,
        injectedWallet,
        coinbaseWallet,
        trustWallet,
        okxWallet,
        rainbowWallet,
        walletConnectWallet,
      ],
    },
    {
      groupName: 'Altri Wallet Polygon',
      wallets: [
        rabbyWallet,
        phantomWallet,
        zerionWallet,
        bitgetWallet,
        safeWallet,
      ],
    },
  ],
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
