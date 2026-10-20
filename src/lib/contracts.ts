/**
 * Configurazione Ufficiale Smart Contracts & ABI per FlowPulseM (Polygon Mainnet & Amoy)
 * Sincronizzato con:
 * - FlowPulseToken.sol (ERC-20 $FPM con MAX_SUPPLY, ERC20Burnable, ERC20Permit EIP-2612, Upload-to-Earn, DAO Staking)
 * - FlowPulseTracks.sol (ERC-1155 Supply + Creator Royalty EIP-2981)
 * - FlowPulseMarketplace.sol (SafeERC20, 0% DJ Fee primaria, Royalty Split automatico secondario, Escrow ERC1155Holder)
 */

export const FLOWPULSE_CONTRACTS = {
  polygon: {
    chainId: 137,
    fpmToken: (process.env.NEXT_PUBLIC_FPM_TOKEN_ADDRESS ||
      '0x0000000000000000000000000000000000000F90') as `0x${string}`,
    tracksNft: (process.env.NEXT_PUBLIC_FPM_TRACKS_ADDRESS ||
      '0x000000000000000000000000000000000000072A') as `0x${string}`,
    marketplace: (process.env.NEXT_PUBLIC_FPM_MARKETPLACE_ADDRESS ||
      '0x0000000000000000000000000000000000000999') as `0x${string}`,
  },
};

export const FLOWPULSE_TOKEN_ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function MAX_SUPPLY() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function transfer(address to, uint256 value) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 value) returns (bool)',
  'function transferFrom(address from, address to, uint256 value) returns (bool)',
  'function burn(uint256 value)',
  'function stake(uint256 amountWei)',
  'function unstake(uint256 amountWei)',
  'function votingPowerOf(address account) view returns (uint256)',
  'function stakedBalance(address account) view returns (uint256)',
  'function distributeReward(address recipient, uint256 amountWei, string reason)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event MiningRewardMinted(address indexed recipient, uint256 amount, string reason)',
  'event StakedForDAO(address indexed user, uint256 amount, uint256 newVotingPower)',
  'event UnstakedFromDAO(address indexed user, uint256 amount, uint256 remainingVotingPower)',
] as const;

export const FLOWPULSE_TRACKS_ERC1155_ABI = [
  'function currentTrackId() view returns (uint256)',
  'function mintTrack(uint256 amount, uint256 priceInFPM, bytes data) returns (uint256)',
  'function mintTrackWithRoyalty(uint256 amount, uint256 priceInFPM, uint16 royaltyBps, string metadataURI, bytes data) returns (uint256)',
  'function getRoyaltyInfo(uint256 trackId, uint256 salePrice) view returns (address receiver, uint256 royaltyAmount)',
  'function uri(uint256 trackId) view returns (string)',
] as const;

export const FLOWPULSE_MARKETPLACE_ABI = [
  'function listTrack(uint256 _trackId, uint256 _amount, uint256 _price) returns (uint256)',
  'function buyTrack(uint256 _listingId, uint256 _amountToBuy)',
  'function cancelListing(uint256 _listingId)',
] as const;
