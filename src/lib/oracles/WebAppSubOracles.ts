'use client';

import {
  getStoredMobileWalletAddress,
  setStoredMobileWalletAddress,
  generateOrGetInstantMobileAddress,
} from '@/lib/wagmi';

export interface MarketplaceTrackItem {
  id: string;
  title: string;
  artist: string;
  type: 'Track' | 'Stem';
  status: 'Trending' | 'New';
  price: number;
  royalty: string;
  seller: string;
  trackId: string;
  stems?: boolean;
  cover?: string;
}

export interface DAOProposalItem {
  id: string;
  code: string;
  title: string;
  description: string;
  status: 'Active' | 'Passed';
   endsIn: string;
  votesFor: number;
  votesAgainst: number;
  userVoted?: 'for' | 'against' | null;
}

export interface GeoDropItem {
  id: string;
  clubName: string;
  city: string;
  djName: string;
  rewardFpm: number;
  nftBadge: string;
  distanceLabel: string;
  claimed: boolean;
}

export interface SubOracleStatus {
  id: string;
  name: string;
  roleDescription: string;
  icon: string;
  color: string;
  healthy: boolean;
  lastAction: string;
  metricsLabel: string;
}

export interface EcosystemState {
  fpmBalance: number;
  djVaultBalance: number;
  stakedFpm: number;
  votingPowerVfpm: number;
  djProfile: {
    stageName: string;
    bio: string;
    ticker: string;
    genre: string;
  };
  marketplaceTracks: MarketplaceTrackItem[];
  fanCollection: MarketplaceTrackItem[];
  daoProposals: DAOProposalItem[];
  geoDrops: GeoDropItem[];
  oracleLogs: Array<{ time: string; oracle: string; message: string }>;
}

const ECOSYSTEM_STORAGE_KEY = 'flowpulse_webapp_oracle_ecosystem_v1';

const DEFAULT_MARKETPLACE_TRACKS: MarketplaceTrackItem[] = [
  {
    id: 'trk-101',
    title: 'Ibiza Sunrise (Original Mix)',
    artist: 'Davide Squillace',
    type: 'Stem',
    status: 'Trending',
    price: 45,
    royalty: '15% Auto-Split Royalty',
    seller: '0x71C...89A2',
    trackId: 'FPM-SIAE-101',
    stems: true,
    cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'trk-102',
    title: 'DC10 Warehouse Groove',
    artist: 'DJ Novus',
    type: 'Track',
    status: 'Trending',
    price: 30,
    royalty: '10% Holder Royalty',
    seller: '0x38F...44B1',
    trackId: 'FPM-SIAE-102',
    stems: false,
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'trk-103',
    title: 'Partenope Deep Stems Pack',
    artist: 'Andrea FlowPulse',
    type: 'Stem',
    status: 'Trending',
    price: 60,
    royalty: '20% Remix Smart Contract',
    seller: '0x99A...12F0',
    trackId: 'FPM-SIAE-103',
    stems: true,
    cover: 'https://images.unsplash.com/photo-1571266028243-cb40fce7573b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'trk-104',
    title: 'Acid Horizon 303',
    artist: 'BerghainLover',
    type: 'Track',
    status: 'New',
    price: 25,
    royalty: '12% Holder Royalty',
    seller: '0x42D...90E3',
    trackId: 'FPM-SIAE-104',
    stems: false,
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
  },
];

const DEFAULT_DAO_PROPOSALS: DAOProposalItem[] = [
  {
    id: 'prop-12',
    code: 'FIP-12',
    title: 'Finanziare il Tour Europeo di "DJ Novus"',
    description:
      'Richiesta di allocare 50.000 $FPM dalla Treasury della piattaforma per supportare il tour promozionale.',
    status: 'Active',
    endsIn: 'Active - Ends in 2 Days',
    votesFor: 7500,
    votesAgainst: 2500,
    userVoted: null,
  },
  {
    id: 'prop-13',
    code: 'FIP-13',
    title: 'Attivare Royalty Istantanee sugli Stems Remix',
    description:
      'Distribuzione automatica del 15% dei proventi agli autori originali ogni volta che uno Stem viene usato nel Web3 Mixer.',
    status: 'Active',
    endsIn: 'Active - Ends in 4 Days',
    votesFor: 8800,
    votesAgainst: 1200,
    userVoted: null,
  },
  {
    id: 'prop-11',
    code: 'FIP-11',
    title: 'Ridurre le gas fee interne al 0.01%',
    description:
      'Votazione completata con successo. Implementazione attiva nello Smart Contract.',
    status: 'Passed',
    endsIn: 'Passed',
    votesFor: 9400,
    votesAgainst: 600,
    userVoted: 'for',
  },
];

const DEFAULT_GEO_DROPS: GeoDropItem[] = [
  {
    id: 'drop-1',
    clubName: 'DC10 Circoloco Arena',
    city: 'Ibiza / Live Zone',
    djName: 'Davide Squillace',
    rewardFpm: 150,
    nftBadge: 'Circoloco Backstage Pass #402',
    distanceLabel: 'Zona Attiva (35m)',
    claimed: false,
  },
  {
    id: 'drop-2',
    clubName: 'FlowPulse Partenope Club',
    city: 'Napoli / Lungomare',
    djName: 'Andrea FlowPulse',
    rewardFpm: 250,
    nftBadge: 'Partenope Founder Vinyl NFT',
    distanceLabel: 'Zona Attiva (10m)',
    claimed: false,
  },
  {
    id: 'drop-3',
    clubName: 'Warehouse Techno Vault',
    city: 'Milano / Tortona',
    djName: 'DJ Novus',
    rewardFpm: 100,
    nftBadge: 'Warehouse Raver Token',
    distanceLabel: 'Zona Attiva (80m)',
    claimed: false,
  },
];

const INITIAL_ECOSYSTEM_STATE: EcosystemState = {
  fpmBalance: 5200,
  djVaultBalance: 42500,
  stakedFpm: 0,
  votingPowerVfpm: 1450,
  djProfile: {
    stageName: 'Andrea FlowPulse',
    bio: 'Techno Pioneer. The official Web3 vault.',
    ticker: 'VINIL',
    genre: 'Tech House / Techno',
  },
  marketplaceTracks: DEFAULT_MARKETPLACE_TRACKS,
  fanCollection: [DEFAULT_MARKETPLACE_TRACKS[0]],
  daoProposals: DEFAULT_DAO_PROPOSALS,
  geoDrops: DEFAULT_GEO_DROPS,
  oracleLogs: [
    {
      time: 'Sistema',
      oracle: 'Master Oracle',
      message: 'Tutti gli 8 Sub-Oracoli di Mansione sono operativi e sincronizzati.',
    },
  ],
};

class WebAppOracleManagerClass {
  private state: EcosystemState = INITIAL_ECOSYSTEM_STATE;
  private initialized = false;

  private ensureLoaded() {
    if (typeof window === 'undefined' || this.initialized) return;
    this.initialized = true;
    try {
      const raw = window.localStorage.getItem(ECOSYSTEM_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.state = {
          ...INITIAL_ECOSYSTEM_STATE,
          ...parsed,
          marketplaceTracks:
            parsed.marketplaceTracks?.length > 0
              ? parsed.marketplaceTracks
              : DEFAULT_MARKETPLACE_TRACKS,
          daoProposals:
            parsed.daoProposals?.length > 0
              ? parsed.daoProposals
              : DEFAULT_DAO_PROPOSALS,
          geoDrops:
            parsed.geoDrops?.length > 0 ? parsed.geoDrops : DEFAULT_GEO_DROPS,
        };
      }
    } catch (e) {
      this.state = { ...INITIAL_ECOSYSTEM_STATE };
    }
  }

  private saveAndNotify(oracleName: string, actionMessage: string) {
    if (typeof window === 'undefined') return;
    const now = new Date().toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    this.state.oracleLogs = [
      { time: now, oracle: oracleName, message: actionMessage },
      ...(this.state.oracleLogs || []).slice(0, 24),
    ];
    try {
      window.localStorage.setItem(ECOSYSTEM_STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {}
    window.dispatchEvent(
      new CustomEvent('flowpulse:ecosystem-updated', { detail: this.state })
    );
  }

  public getState(): EcosystemState {
    this.ensureLoaded();
    return this.state;
  }

  // ============================================================================
  // 1. MANSIONE WALLET SUB-ORACLE (Mobile & Web3 Connection)
  // ============================================================================
  public walletOracle = {
    ensureConnectedOrCreateMobile: (): `0x${string}` => {
      this.ensureLoaded();
      const existing = getStoredMobileWalletAddress();
      if (existing) {
        this.saveAndNotify(
          'Oracolo Wallet',
          `Wallet verificato e attivo su Polygon (${existing.slice(0, 6)}...${existing.slice(-4)})`
        );
        return existing;
      }
      const created = generateOrGetInstantMobileAddress();
      this.saveAndNotify(
        'Oracolo Wallet',
        `Attivato Wallet Mobile Rapido su Polygon: ${created.slice(0, 6)}...${created.slice(-4)}`
      );
      return created;
    },
    bindCustomAddress: (addr: string): `0x${string}` | null => {
      this.ensureLoaded();
      const saved = setStoredMobileWalletAddress(addr, 'Oracolo Wallet Mobile');
      if (saved) {
        this.saveAndNotify(
          'Oracolo Wallet',
          `Collegato indirizzo Wallet: ${saved.slice(0, 6)}...${saved.slice(-4)}`
        );
      }
      return saved;
    },
  };

  // ============================================================================
  // 2. MANSIONE MARKETPLACE & SIAE SUB-ORACLE
  // ============================================================================
  public marketplaceOracle = {
    buyTrack: (trackId: string): { success: boolean; message: string; track?: MarketplaceTrackItem } => {
      this.ensureLoaded();
      const track = this.state.marketplaceTracks.find((t) => t.id === trackId || t.trackId === trackId);
      if (!track) {
        return { success: false, message: 'Traccia non trovata nel catalogo.' };
      }
      if (this.state.fpmBalance < track.price) {
        this.state.fpmBalance += track.price; // Auto-topup di sicurezza Oracolo se saldo insufficiente in demo
      }
      this.state.fpmBalance = Math.max(0, Number((this.state.fpmBalance - track.price).toFixed(2)));
      const alreadyOwned = this.state.fanCollection.some((c) => c.id === track.id);
      if (!alreadyOwned) {
        this.state.fanCollection = [track, ...this.state.fanCollection];
      }
      this.saveAndNotify(
        'Oracolo Marketplace & SIAE',
        `Acquistata "${track.title}" di ${track.artist} (${track.price} $FPM) e aggiunta al Web3 Vault.`
      );
      return {
        success: true,
        message: `"${track.title}" acquistata! Aggiunta alla tua Fan Collection e pronta per il Certificato SIAE.`,
        track,
      };
    },

    publishNewTrack: (title: string, artist: string, price = 35, isStem = true): MarketplaceTrackItem => {
      this.ensureLoaded();
      const newTrack: MarketplaceTrackItem = {
        id: 'trk-' + Date.now(),
        title: title.trim() || 'Unreleased Club ID',
        artist: artist.trim() || this.state.djProfile.stageName || 'FlowPulse DJ',
        type: isStem ? 'Stem' : 'Track',
        status: 'Trending',
        price: Number(price) || 35,
        royalty: isStem ? '15% Remix Smart Contract' : '10% Holder Royalty',
        seller: getStoredMobileWalletAddress() || '0x71C...89A2',
        trackId: 'FPM-SIAE-' + Math.floor(100 + Math.random() * 900),
        stems: isStem,
        cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      };
      this.state.marketplaceTracks = [newTrack, ...this.state.marketplaceTracks];
      this.saveAndNotify(
        'Oracolo Marketplace & SIAE',
        `Pubblicato nuovo Drop "${newTrack.title}" (${newTrack.price} $FPM) nel Marketplace e in Compravendita.`
      );
      return newTrack;
    },
  };

  // ============================================================================
  // 3. MANSIONE DJ STUDIO & FINANZA SUB-ORACLE
  // ============================================================================
  public djStudioOracle = {
    withdrawFunds: (amount?: number): { withdrawn: number; newFanBalance: number } => {
      this.ensureLoaded();
      const toWithdraw = amount && amount > 0 ? Math.min(amount, this.state.djVaultBalance) : 1000;
      this.state.djVaultBalance = Math.max(0, this.state.djVaultBalance - toWithdraw);
      this.state.fpmBalance = Number((this.state.fpmBalance + toWithdraw).toFixed(2));
      const walletAddr = this.walletOracle.ensureConnectedOrCreateMobile();
      this.saveAndNotify(
        'Oracolo DJ Studio',
        `Prelevati ${toWithdraw} $FPM dalla cassaforte DJ verso il Wallet (${walletAddr.slice(0, 6)}...${walletAddr.slice(-4)}).`
      );
      return { withdrawn: toWithdraw, newFanBalance: this.state.fpmBalance };
    },

    saveDJProfile: (stageName: string, bio: string, ticker: string, genre: string) => {
      this.ensureLoaded();
      this.state.djProfile = {
        stageName: stageName || this.state.djProfile.stageName,
        bio: bio || this.state.djProfile.bio,
        ticker: ticker || this.state.djProfile.ticker,
        genre: genre || this.state.djProfile.genre,
      };
      this.saveAndNotify(
        'Oracolo DJ Studio',
        `Aggiornata Vetrina Artista DJ: ${this.state.djProfile.stageName} ($${this.state.djProfile.ticker}).`
      );
    },
  };

  // ============================================================================
  // 4. MANSIONE FAN VAULT & LIQUIDITÀ SUB-ORACLE
  // ============================================================================
  public fanVaultOracle = {
    buyFpmCoins: (amount = 500) => {
      this.ensureLoaded();
      this.state.fpmBalance = Number((this.state.fpmBalance + amount).toFixed(2));
      this.saveAndNotify(
        'Oracolo Fan Vault',
        `Accreditati +${amount} $FPM nel saldo personale del Wallet.`
      );
      return this.state.fpmBalance;
    },

    withdrawFpmToWallet: (amount = 250) => {
      this.ensureLoaded();
      const actual = Math.min(this.state.fpmBalance, amount);
      this.state.fpmBalance = Number((this.state.fpmBalance - actual).toFixed(2));
      const addr = this.walletOracle.ensureConnectedOrCreateMobile();
      this.saveAndNotify(
        'Oracolo Fan Vault',
        `Trasferiti ${actual} $FPM su rete Polygon all'indirizzo ${addr.slice(0, 6)}...${addr.slice(-4)}.`
      );
      return { transferred: actual, remaining: this.state.fpmBalance };
    },
  };

  // ============================================================================
  // 5. MANSIONE MINING & UPLOAD-TO-EARN SUB-ORACLE
  // ============================================================================
  public miningStudioOracle = {
    completeTrackMining: (minedAmount: number, trackTitle?: string) => {
      this.ensureLoaded();
      const reward = Math.max(0.5, Number(minedAmount.toFixed(4)));
      this.state.fpmBalance = Number((this.state.fpmBalance + reward).toFixed(4));
      this.state.djVaultBalance = Number((this.state.djVaultBalance + reward * 10).toFixed(2));
      if (trackTitle) {
        this.marketplaceOracle.publishNewTrack(trackTitle, this.state.djProfile.stageName, 40, true);
      }
      this.saveAndNotify(
        'Oracolo Upload-to-Earn',
        `Mining Proof-of-Contribution completato: +${reward} $FPM accreditati sul Wallet!`
      );
      return this.state.fpmBalance;
    },
  };

  // ============================================================================
  // 6. MANSIONE GOVERNANCE DAO SUB-ORACLE
  // ============================================================================
  public daoOracle = {
    stakeFpm: (amount: number): { success: boolean; message: string } => {
      this.ensureLoaded();
      const cleanAmount = Number(amount);
      if (!cleanAmount || cleanAmount <= 0) {
        return { success: false, message: 'Inserisci un importo valido di $FPM da mettere in stake.' };
      }
      const actualStake = Math.min(cleanAmount, Math.max(cleanAmount, this.state.fpmBalance));
      this.state.fpmBalance = Math.max(0, Number((this.state.fpmBalance - cleanAmount).toFixed(2)));
      this.state.stakedFpm += actualStake;
      this.state.votingPowerVfpm += Math.round(actualStake * 1.25);
      this.saveAndNotify(
        'Oracolo Governance DAO',
        `Messi in stake ${actualStake} $FPM -> Potere di voto salito a ${this.state.votingPowerVfpm} vFPM!`
      );
      return {
        success: true,
        message: `Hai messo in stake ${actualStake} $FPM! Il tuo potere di voto ora è ${this.state.votingPowerVfpm} vFPM.`,
      };
    },

    voteProposal: (proposalId: string, direction: 'for' | 'against') => {
      this.ensureLoaded();
      const weight = Math.max(250, this.state.votingPowerVfpm);
      this.state.daoProposals = this.state.daoProposals.map((p) => {
        if (p.id !== proposalId && p.code !== proposalId) return p;
        return {
          ...p,
          votesFor: direction === 'for' ? p.votesFor + weight : p.votesFor,
          votesAgainst: direction === 'against' ? p.votesAgainst + weight : p.votesAgainst,
          userVoted: direction,
        };
      });
      this.saveAndNotify(
        'Oracolo Governance DAO',
        `Registrato voto ${direction === 'for' ? 'FAVOREVOLE' : 'CONTRARIO'} (${weight} vFPM) su ${proposalId}.`
      );
    },
  };

  // ============================================================================
  // 7. MANSIONE GEO-DROPS (PROOF OF DANCE) SUB-ORACLE
  // ============================================================================
  public geoDropsOracle = {
    claimGeoDrop: (dropId: string): { reward: number; badge: string } | null => {
      this.ensureLoaded();
      const target = this.state.geoDrops.find((d) => d.id === dropId);
      if (!target) return null;
      if (target.claimed) {
        return { reward: target.rewardFpm, badge: target.nftBadge };
      }
      this.state.geoDrops = this.state.geoDrops.map((d) =>
        d.id === dropId ? { ...d, claimed: true } : d
      );
      this.state.fpmBalance = Number((this.state.fpmBalance + target.rewardFpm).toFixed(2));
      this.saveAndNotify(
        'Oracolo Geo-Drops',
        `Riscattato Proof-of-Dance "${target.nftBadge}" a ${target.clubName} (+${target.rewardFpm} $FPM)!`
      );
      return { reward: target.rewardFpm, badge: target.nftBadge };
    },

    scanAndSpawnLocalDrop: (cityOrClub = 'Club Mobile Live Zone') => {
      this.ensureLoaded();
      const newDrop: GeoDropItem = {
        id: 'drop-' + Date.now(),
        clubName: cityOrClub,
        city: 'Posizione GPS Verificata',
        djName: this.state.djProfile.stageName || 'Resident DJ',
        rewardFpm: 200,
        nftBadge: `VIP Dancefloor Pass #${Math.floor(100 + Math.random() * 899)}`,
        distanceLabel: '0m (Sei nel Club!)',
        claimed: false,
      };
      this.state.geoDrops = [newDrop, ...this.state.geoDrops];
      this.saveAndNotify(
        'Oracolo Geo-Drops',
        `Rilevato nuovo Geo-Drop attivo nella tua posizione: ${newDrop.clubName} (+${newDrop.rewardFpm} $FPM).`
      );
      return newDrop;
    },
  };

  // ============================================================================
  // 8. LISTA STATO DEGLI 8 SUB-ORACOLI PER MANSIONE + INTERPRETE LINGUAGGIO UMANO
  // ============================================================================
  public getAllSubOraclesStatus(): SubOracleStatus[] {
    this.ensureLoaded();
    const walletAddr = getStoredMobileWalletAddress();
    return [
      {
        id: 'wallet',
        name: '1. Oracolo Wallet Mobile & Web3',
        roleDescription: 'Garantisce collegamento Wallet da cellulare (0x diretto, Deep-Link e Polygon RPC)',
        icon: '👛',
        color: '#00f0ff',
        healthy: true,
        lastAction: walletAddr
          ? `Connesso: ${walletAddr.slice(0, 6)}...${walletAddr.slice(-4)}`
          : 'Pronto al collegamento istantaneo Mobile/PC',
        metricsLabel: `${this.state.fpmBalance.toLocaleString('it-IT')} $FPM`,
      },
      {
        id: 'marketplace',
        name: '2. Oracolo Marketplace & SIAE',
        roleDescription: 'Gestisce compravendita tracce/Stems, smart contract royalty e certificati SIAE PDF',
        icon: '🛒',
        color: '#a855f7',
        healthy: true,
        lastAction: `${this.state.marketplaceTracks.length} tracce/stems attive sul mercato`,
        metricsLabel: `${this.state.marketplaceTracks.length} Drop`,
      },
      {
        id: 'dj_studio',
        name: '3. Oracolo DJ Studio & Finanza',
        roleDescription: 'Supervisiona incassi 0% fee, prelievi DJ, Subcoin e Vetrina Artista',
        icon: '🎧',
        color: '#3b82f6',
        healthy: true,
        lastAction: `Artista: ${this.state.djProfile.stageName} ($${this.state.djProfile.ticker})`,
        metricsLabel: `${this.state.djVaultBalance.toLocaleString('it-IT')} $FPM Vault`,
      },
      {
        id: 'fan_vault',
        name: '4. Oracolo Fan Vault & Royalty',
        roleDescription: 'Custodisce la collezione NFT del Fan, ascolto Stems e acquisto/prelievo $FPM',
        icon: '🔥',
        color: '#00ff88',
        healthy: true,
        lastAction: `${this.state.fanCollection.length} brani/stems nel Web3 Vault`,
        metricsLabel: `${this.state.fanCollection.length} NFT`,
      },
      {
        id: 'mining_studio',
        name: '5. Oracolo Upload-to-Earn Mining',
        roleDescription: 'Converte il caricamento tracce in ricompense $FPM e separa gli Stems AI',
        icon: '⛏️',
        color: '#ffd700',
        healthy: true,
        lastAction: 'Motore Proof-of-Contribution attivo',
        metricsLabel: 'Mining Ready',
      },
      {
        id: 'dao_governance',
        name: '6. Oracolo Governance DAO',
        roleDescription: 'Gestisce staking $FPM, calcolo potere di voto vFPM e scrutinio proposte FIP',
        icon: '🏛️',
        color: '#f59e0b',
        healthy: true,
        lastAction: `${this.state.daoProposals.length} proposte DAO monitorate`,
        metricsLabel: `${this.state.votingPowerVfpm.toLocaleString('it-IT')} vFPM`,
      },
      {
        id: 'geo_drops',
        name: '7. Oracolo Geo-Drops (Proof of Dance)',
        roleDescription: 'Sblocca Airdrop geolocalizzati nei club e pass backstage NFT da cellulare',
        icon: '📍',
        color: '#10b981',
        healthy: true,
        lastAction: `${this.state.geoDrops.filter((d) => !d.claimed).length} Geo-Drops riscattabili`,
        metricsLabel: `${this.state.geoDrops.length} Zone`,
      },
      {
        id: 'audio_feed',
        name: '8. Oracolo Audio, Mixer & Flow Feed',
        roleDescription: 'Garantisce sblocco WebAudio su iOS/Android, console DJ 2-Deck e player social',
        icon: '🎛️',
        color: '#ff3366',
        healthy: true,
        lastAction: 'Bus Audio Web3 & Sintesi Tone.js pronti',
        metricsLabel: 'Audio 100%',
      },
    ];
  }

  /**
   * Interpreta qualsiasi comando scritto dall'utente in linguaggio umano
   * e lo smista automaticamente al Sub-Oracolo della mansione competente!
   */
  public executeHumanCommand(prompt: string): { oracle: string; response: string; routeSuggestion?: string } {
    this.ensureLoaded();
    const text = prompt.toLowerCase().trim();

    if (!text) {
      return {
        oracle: 'Master Oracle',
        response: 'Scrivi qualsiasi mansione da eseguire (es. "collega wallet mobile", "crea drop techno", "vota nella dao", "riscatta geo-drop", "ricarica 1000 FPM").',
      };
    }

    // 1. Mansione Wallet
    if (text.includes('wallet') || text.includes('portafoglio') || text.includes('cellulare') || text.includes('0x') || text.includes('metamask')) {
      const matchHex = prompt.match(/0x[a-fA-F0-9]{40}/);
      if (matchHex) {
        const bound = this.walletOracle.bindCustomAddress(matchHex[0]);
        return {
          oracle: '1. Oracolo Wallet Mobile & Web3',
          response: `Ho collegato immediatamente il tuo indirizzo Wallet ${bound} su tutta la Web App!`,
        };
      }
      const addr = this.walletOracle.ensureConnectedOrCreateMobile();
      return {
        oracle: '1. Oracolo Wallet Mobile & Web3',
        response: `Il tuo Wallet Mobile Polygon è attivo e collegato (${addr.slice(0, 6)}...${addr.slice(-4)}). Tutte le funzioni Web3 sono sbloccate!`,
      };
    }

    // 2. Mansione Geo-Drops
    if (text.includes('drop') && (text.includes('geo') || text.includes('zona') || text.includes('club') || text.includes('dance') || text.includes('ibiza') || text.includes('napoli'))) {
      const unclaimed = this.state.geoDrops.find((d) => !d.claimed);
      if (unclaimed) {
        const res = this.geoDropsOracle.claimGeoDrop(unclaimed.id);
        return {
          oracle: '7. Oracolo Geo-Drops',
          response: `Ho riscattato per te il Geo-Drop "${res?.badge}" (+${res?.reward} $FPM accreditati sul tuo saldo)!`,
          routeSuggestion: '/drops',
        };
      }
      const spawned = this.geoDropsOracle.scanAndSpawnLocalDrop('FlowPulse Secret Arena');
      return {
        oracle: '7. Oracolo Geo-Drops',
        response: `Ho generato un nuovo Geo-Drop nella tua zona: "${spawned.nftBadge}" (+${spawned.rewardFpm} $FPM)!`,
        routeSuggestion: '/drops',
      };
    }

    // 3. Mansione Marketplace / Nuova Traccia / Compravendita
    if (text.includes('pubblica') || text.includes('crea traccia') || text.includes('nuovo brano') || text.includes('marketplace') || text.includes('vendi') || text.includes('drop')) {
      const cleanTitle = prompt.replace(/pubblica|crea traccia|nuovo brano|marketplace|vendi|drop/gi, '').trim() || 'Oracle Club Anthem';
      const created = this.marketplaceOracle.publishNewTrack(cleanTitle, this.state.djProfile.stageName, 45, true);
      return {
        oracle: '2. Oracolo Marketplace & SIAE',
        response: `Ho pubblicato il nuovo Drop "${created.title}" (${created.price} $FPM, codice ${created.trackId}) nel Marketplace e nella Camera di Compravendita SIAE!`,
        routeSuggestion: '/marketplace',
      };
    }

    // 4. Mansione DAO / Voto / Stake
    if (text.includes('dao') || text.includes('vota') || text.includes('voto') || text.includes('stake') || text.includes('proposta')) {
      this.daoOracle.stakeFpm(500);
      this.daoOracle.voteProposal('prop-12', 'for');
      return {
        oracle: '6. Oracolo Governance DAO',
        response: `Ho messo in stake 500 $FPM aumentando il tuo potere di voto a ${this.state.votingPowerVfpm} vFPM e ho registrato il tuo voto FAVOREVOLE sulla proposta attiva!`,
        routeSuggestion: '/governance',
      };
    }

    // 5. Mansione Mining / Upload-to-Earn
    if (text.includes('mina') || text.includes('mining') || text.includes('upload') || text.includes('carica')) {
      const newBal = this.miningStudioOracle.completeTrackMining(25, 'Studio AI Master Stem');
      return {
        oracle: '5. Oracolo Upload-to-Earn',
        response: `Mining Proof-of-Contribution eseguito: +25 $FPM accreditati (Saldo attuale: ${newBal.toLocaleString('it-IT')} $FPM) e traccia pubblicata!`,
        routeSuggestion: '/studio',
      };
    }

    // 6. Mansione Prelievo / Saldo / FPM Coin
    if (text.includes('fpm') || text.includes('saldo') || text.includes('ricarica') || text.includes('acquista') || text.includes('preleva') || text.includes('soldi')) {
      const newBal = this.fanVaultOracle.buyFpmCoins(1000);
      return {
        oracle: '4. Oracolo Fan Vault & Royalty',
        response: `Ho accreditato +1.000 $FPM sul tuo Wallet! Il tuo nuovo saldo disponibile è ${newBal.toLocaleString('it-IT')} $FPM.`,
        routeSuggestion: '/dashboard/fan',
      };
    }

    // 7. Verifica / Riparazione Generale di tutte le 8 mansioni
    const addr = this.walletOracle.ensureConnectedOrCreateMobile();
    this.saveAndNotify(
      'Master Oracle',
      `Eseguita verifica completa su "${prompt}": tutti gli 8 Sub-Oracoli sono attivi.`
    );
    return {
      oracle: 'Master Oracle (8 Sub-Oracoli)',
      response: `Ho verificato tutte le 8 mansioni della Web App per "${prompt}": Wallet attivo (${addr.slice(0, 6)}...${addr.slice(-4)}), Saldo ${this.state.fpmBalance} $FPM, ${this.state.marketplaceTracks.length} tracce Marketplace, ${this.state.geoDrops.length} Geo-Drops e DAO pronta!`,
    };
  }

  private booted = false;

  /**
   * Avvia in background (in modo totalmente invisibile all'utente) tutti gli 8 Sub-Oracoli:
   * - Sblocco automatico WebAudio al primo touch su cellulare (iOS/Android)
   * - Pre-warming RPC Polygon e recupero sessione Wallet mobile
   * - Prefetching intelligente delle rotte per navigazione istantanea
   */
  public bootSilentSubOracles() {
    if (typeof window === 'undefined' || this.booted) return;
    this.booted = true;
    this.ensureLoaded();

    // Sub-Oracolo 8 (Audio): sblocca silenziosamente AudioContext al primo touch/click su mobile
    const unlockMobileAudio = async () => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          if (ctx.state === 'suspended') {
            await ctx.resume();
          }
        }
      } catch (e) {}
      window.removeEventListener('touchstart', unlockMobileAudio);
      window.removeEventListener('click', unlockMobileAudio);
    };
    window.addEventListener('touchstart', unlockMobileAudio, { passive: true });
    window.addEventListener('click', unlockMobileAudio, { passive: true });

    // Sub-Oracolo 1 (Wallet & RPC): pre-warm connessione RPC Polygon in idle
    const scheduleIdle = (window as any).requestIdleCallback || ((cb: any) => setTimeout(cb, 300));
    scheduleIdle(() => {
      fetch('https://polygon.drpc.org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_chainId', params: [], id: 1 }),
      }).catch(() => {});
    });
  }
}

export const webAppOracleManager = new WebAppOracleManagerClass();

