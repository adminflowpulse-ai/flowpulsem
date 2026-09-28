import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygon, polygonAmoy } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'FlowPulseM',
  projectId: 'b56e18d47c72ab683b10817156fc74f4', // Default placeholder for WalletConnect v2
  chains: [polygon, polygonAmoy],
  transports: {
    [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/alch_iY4Om1Mq13r9AN4GhF26E`),
    [polygonAmoy.id]: http(`https://polygon-amoy.g.alchemy.com/v2/alch_iY4Om1Mq13r9AN4GhF26E`)
  },
  ssr: false,
});
