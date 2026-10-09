import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  rainbowWallet,
  walletConnectWallet,
  trustWallet,
  rabbyWallet,
  phantomWallet,
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
// Risolve il bug di RainbowKit dove, se window.ethereum viene iniettato dopo la valutazione del modulo,
// metaMaskWallet fallisce ricadendo su WalletConnect che si blocca con errore 403.
// Questo connettore chiama direttamente window.ethereum.request({ method: 'eth_requestAccounts' })
// garantendo l'apertura immediata del popup MetaMask nel browser.
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
      groupName: 'Consigliati',
      wallets: [
        customMetaMaskWallet,
        injectedWallet,
        coinbaseWallet,
        rainbowWallet,
        walletConnectWallet,
      ],
    },
    {
      groupName: 'Altri Wallet',
      wallets: [
        trustWallet,
        rabbyWallet,
        phantomWallet,
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
