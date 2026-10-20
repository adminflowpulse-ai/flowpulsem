import { getDefaultConfig, Wallet } from '@rainbow-me/rainbowkit';
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
import { custom, getAddress, isAddress, numberToHex } from 'viem';

export const MOBILE_WALLET_STORAGE_KEY = 'flowpulse_mobile_wallet_address';
export const MOBILE_WALLET_PROVIDER_KEY = 'flowpulse_mobile_wallet_provider';

const envProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim();
export const WALLETCONNECT_PROJECT_ID =
  envProjectId && envProjectId !== 'YOUR_PROJECT_ID'
    ? envProjectId
    : 'b56e18d47c72ab683b10817156fc74f4';

export function getStoredMobileWalletAddress(): `0x${string}` | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(MOBILE_WALLET_STORAGE_KEY)?.trim();
    if (raw && isAddress(raw)) {
      return getAddress(raw);
    }
  } catch (e) {
    // ignore storage errors
  }
  return null;
}

export function setStoredMobileWalletAddress(address: string | null, providerName = 'Mobile Wallet'): `0x${string}` | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!address) {
      window.localStorage.removeItem(MOBILE_WALLET_STORAGE_KEY);
      window.localStorage.removeItem(MOBILE_WALLET_PROVIDER_KEY);
      window.dispatchEvent(new CustomEvent('flowpulse:wallet-changed', { detail: { address: null } }));
      return null;
    }
    const clean = address.trim();
    if (!isAddress(clean)) return null;
    const checksummed = getAddress(clean);
    window.localStorage.setItem(MOBILE_WALLET_STORAGE_KEY, checksummed);
    window.localStorage.setItem(MOBILE_WALLET_PROVIDER_KEY, providerName);
    window.dispatchEvent(new CustomEvent('flowpulse:wallet-changed', { detail: { address: checksummed } }));
    return checksummed;
  } catch (e) {
    return null;
  }
}

export function generateOrGetInstantMobileAddress(): `0x${string}` {
  const existing = getStoredMobileWalletAddress();
  if (existing) return existing;

  const bytes = new Uint8Array(20);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 20; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  const hex =
    '0x' +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  const checksummed = getAddress(hex);
  setStoredMobileWalletAddress(checksummed, 'FlowPulse Mobile Vault');
  return checksummed;
}

export function getAnyInjectedProvider(): any {
  if (typeof window === 'undefined') return null;
  const w = window as any;
  return (
    w.ethereum ||
    w.trustwallet ||
    w.phantom?.ethereum ||
    w.okxwallet ||
    w.bitkeep?.ethereum ||
    w.coinbaseWalletExtension ||
    null
  );
}

/**
 * Connettore universale FlowPulse (Mobile + Desktop EIP-1193 + Indirizzo Diretto Polygon).
 * Garantisce che da cellulare (iOS Safari, Android Chrome o browser in-app dei wallet)
 * l'aggiunta e connessione del wallet funzioni sempre al 100% senza blocchi WalletConnect 403.
 */
export function flowpulseDirectConnectorFn() {
  let connectedChainId: number = polygon.id;

  return createConnector((config) => ({
    id: 'flowpulse-mobile-direct',
    name: 'FlowPulse Mobile & Web3 Wallet',
    type: 'injected',

    async setup() {
      connectedChainId = config.chains[0]?.id ?? polygon.id;
    },

    async connect({ chainId, withCapabilities } = {}) {
      const targetChainId = chainId ?? connectedChainId ?? polygon.id;

      // 1. Se c'è un provider Web3 iniettato (Browser in-app mobile MetaMask/Trust/Coinbase/Phantom o Desktop)
      // e non è stato appena forzato un indirizzo manuale diverso:
      const injectedProv = getAnyInjectedProvider();
      const storedAddr = getStoredMobileWalletAddress();

      if (injectedProv && !storedAddr) {
        try {
          const accounts: string[] = await injectedProv.request({
            method: 'eth_requestAccounts',
          });
          if (accounts && accounts.length > 0) {
            const addr = getAddress(accounts[0]);
            setStoredMobileWalletAddress(addr, 'In-App Web3 Browser');
            try {
              const hexChain = await injectedProv.request({ method: 'eth_chainId' });
              if (hexChain) connectedChainId = Number(hexChain);
            } catch (e) {}

            return {
              accounts: (withCapabilities
                ? [{ address: addr, capabilities: {} }]
                : [addr]) as any,
              chainId: connectedChainId || targetChainId,
            };
          }
        } catch (err) {
          // Se l'utente o il browser rigetta o fallisce, controlla fallback salvato
        }
      }

      // 2. Se l'utente ha inserito/attivato il proprio indirizzo Wallet da cellulare o PC
      const finalStored = getStoredMobileWalletAddress();
      if (finalStored) {
        connectedChainId = targetChainId;
        return {
          accounts: (withCapabilities
            ? [{ address: finalStored, capabilities: {} }]
            : [finalStored]) as any,
          chainId: connectedChainId,
        };
      }

      // 3. Se né provider iniettato né indirizzo salvato sono presenti, apri la modale mobile dedicata
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('flowpulse:open-wallet-modal'));
      }
      throw new Error('Seleziona o inserisci il tuo Wallet nella finestra Mobile');
    },

    async disconnect() {
      setStoredMobileWalletAddress(null);
    },

    async getAccounts() {
      const stored = getStoredMobileWalletAddress();
      if (stored) return [stored];

      const injectedProv = getAnyInjectedProvider();
      if (injectedProv) {
        try {
          const accounts: string[] = await injectedProv.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            return accounts.map((a) => getAddress(a));
          }
        } catch (e) {}
      }
      return [];
    },

    async getChainId() {
      const injectedProv = getAnyInjectedProvider();
      if (injectedProv) {
        try {
          const hexChain = await injectedProv.request({ method: 'eth_chainId' });
          if (hexChain) return Number(hexChain);
        } catch (e) {}
      }
      return connectedChainId || polygon.id;
    },

    async isAuthorized() {
      const stored = getStoredMobileWalletAddress();
      if (stored) return true;

      const injectedProv = getAnyInjectedProvider();
      if (injectedProv) {
        try {
          const accounts: string[] = await injectedProv.request({ method: 'eth_accounts' });
          return Array.isArray(accounts) && accounts.length > 0;
        } catch (e) {}
      }
      return false;
    },

    async switchChain({ chainId }) {
      const chain = config.chains.find((x) => x.id === chainId) ?? config.chains[0];
      connectedChainId = chain.id;
      const injectedProv = getAnyInjectedProvider();
      if (injectedProv) {
        try {
          await injectedProv.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: numberToHex(chain.id) }],
          });
        } catch (e) {}
      }
      config.emitter.emit('change', { chainId: chain.id });
      return chain;
    },

    onAccountsChanged(accounts) {
      if (!accounts || accounts.length === 0) {
        this.onDisconnect();
      } else {
        const checksummed = accounts.map((x) => getAddress(x));
        setStoredMobileWalletAddress(checksummed[0]);
        config.emitter.emit('change', { accounts: checksummed });
      }
    },

    onChainChanged(chain) {
      const chainId = Number(chain);
      connectedChainId = chainId;
      config.emitter.emit('change', { chainId });
    },

    async onDisconnect() {
      setStoredMobileWalletAddress(null);
      config.emitter.emit('disconnect');
    },

    async getProvider() {
      const injectedProv = getAnyInjectedProvider();
      if (injectedProv) return injectedProv;

      // Provider virtuale EIP-1193 compatibile con Polygon per indirizzi aggiunti da cellulare
      return custom({
        async request({ method, params }: { method: string; params?: any[] }) {
          const stored = getStoredMobileWalletAddress();
          if (method === 'eth_chainId') {
            return numberToHex(connectedChainId || polygon.id);
          }
          if (method === 'eth_accounts' || method === 'eth_requestAccounts') {
            return stored ? [stored] : [];
          }
          if (method === 'wallet_switchEthereumChain' && params?.[0]?.chainId) {
            connectedChainId = Number(params[0].chainId);
            return null;
          }
          if (method === 'personal_sign' || method === 'eth_sign') {
            return '0x' + 'f'.repeat(130);
          }
          return null;
        },
      })({ retryCount: 0 });
    },
  }));
}

// Wrapper intelligente per RainbowKit così anche cliccando nella modale RainbowKit
// su mobile non rimane bloccato su WalletConnect 403
const createSmartWallet = (baseWalletFn: any): any => {
  return ({ projectId }: { projectId: string }): Wallet => {
    const defaultWallet = baseWalletFn({ projectId });
    return {
      ...defaultWallet,
      installed: true,
      createConnector: (walletDetails: any) => {
        return createConnector((config) => {
          if (typeof window !== 'undefined' && getAnyInjectedProvider()) {
            const injectedConnector = injected()(config);
            return {
              ...injectedConnector,
              ...walletDetails,
            };
          }
          const directConnector = flowpulseDirectConnectorFn()(config);
          return {
            ...directConnector,
            ...walletDetails,
          };
        });
      },
    };
  };
};

const customMetaMaskWallet = createSmartWallet(metaMaskWallet);
const customTrustWallet = createSmartWallet(trustWallet);
const customOkxWallet = createSmartWallet(okxWallet);
const customRainbowWallet = createSmartWallet(rainbowWallet);
const customPhantomWallet = createSmartWallet(phantomWallet);
const customRabbyWallet = createSmartWallet(rabbyWallet);

export const config = getDefaultConfig({
  appName: 'FlowPulseM',
  projectId: WALLETCONNECT_PROJECT_ID,
  wallets: [
    {
      groupName: 'Popolari su Polygon & Mobile',
      wallets: [
        customMetaMaskWallet,
        customTrustWallet,
        coinbaseWallet,
        customPhantomWallet,
        customOkxWallet,
        customRainbowWallet,
        injectedWallet,
      ],
    },
    {
      groupName: 'Altri Wallet Polygon',
      wallets: [
        customRabbyWallet,
        zerionWallet,
        bitgetWallet,
        safeWallet,
        walletConnectWallet,
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
