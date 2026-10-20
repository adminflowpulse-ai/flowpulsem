'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { isAddress, getAddress } from 'viem';
import {
  getStoredMobileWalletAddress,
  setStoredMobileWalletAddress,
  generateOrGetInstantMobileAddress,
  getAnyInjectedProvider,
  flowpulseDirectConnectorFn,
} from '@/lib/wagmi';

export function useFlowPulseAccount() {
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();
  const [storedAddr, setStoredAddr] = useState<`0x${string}` | null>(null);

  useEffect(() => {
    setStoredAddr(getStoredMobileWalletAddress());
    const onWalletChanged = (e: any) => {
      setStoredAddr(e?.detail?.address ?? getStoredMobileWalletAddress());
    };
    window.addEventListener('flowpulse:wallet-changed', onWalletChanged);
    return () => window.removeEventListener('flowpulse:wallet-changed', onWalletChanged);
  }, []);

  const address = wagmiAddress || storedAddr || undefined;
  const isConnected = Boolean(wagmiConnected && wagmiAddress) || Boolean(storedAddr);
  return { address, isConnected };
}

interface WalletConnectTriggerProps {
  compact?: boolean;
  label?: string;
}

export default function WalletConnectTrigger({
  compact = false,
  label,
}: WalletConnectTriggerProps) {
  const { address, isConnected } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [storedFallbackAddr, setStoredFallbackAddr] = useState<`0x${string}` | null>(null);

  const effectiveAddress = (address || storedFallbackAddr || undefined) as `0x${string}` | undefined;
  const effectiveConnected = Boolean(isConnected && address) || Boolean(storedFallbackAddr);
  const { data: balanceData } = useBalance({ address: effectiveAddress });

  const connectWithFlowPulseConnector = useCallback(
    async (targetAddr?: `0x${string}`) => {
      if (targetAddr) {
        setStoredFeedbackAddr(targetAddr);
      }
      const targetConnector =
        connectors.find((c) => c.id === 'flowpulse-mobile-direct' || c.id === 'metaMask' || c.id === 'injected') ||
        connectors[0];

      try {
        if (targetConnector) {
          await connectAsync({ connector: targetConnector });
        } else {
          await connectAsync({ connector: flowpulseDirectConnectorFn() });
        }
      } catch (e) {
        try {
          await connectAsync({ connector: flowpulseDirectConnectorFn() });
        } catch (err) {}
      }
    },
    [connectors, connectAsync]
  );

  const setStoredFeedbackAddr = (addr: `0x${string}` | null) => {
    setStoredFallbackAddr(addr);
  };

  useEffect(() => {
    setMounted(true);
    const saved = getStoredMobileWalletAddress();
    if (saved) {
      setStoredFallbackAddr(saved);
      setManualAddress(saved);
    }

    const handleOpenEvent = () => setIsModalOpen(true);
    const handleWalletChanged = (e: any) => {
      const nextAddr = e?.detail?.address ?? getStoredMobileWalletAddress();
      setStoredFallbackAddr(nextAddr);
      if (nextAddr) setManualAddress(nextAddr);
    };
    window.addEventListener('flowpulse:open-wallet-modal', handleOpenEvent);
    window.addEventListener('flowpulse:wallet-changed', handleWalletChanged);
    return () => {
      window.removeEventListener('flowpulse:open-wallet-modal', handleOpenEvent);
      window.removeEventListener('flowpulse:wallet-changed', handleWalletChanged);
    };
  }, []);

  // Auto-riconnessione se c'è un wallet salvato su cellulare o se si arriva da ?autoconnect=1
  useEffect(() => {
    if (!mounted) return;

    const saved = getStoredMobileWalletAddress();
    if (saved && !isConnected) {
      connectWithFlowPulseConnector(saved);
    }

    if (typeof window !== 'undefined' && window.location.search.includes('autoconnect=1')) {
      const prov = getAnyInjectedProvider();
      if (prov && !isConnected) {
        (async () => {
          try {
            const accounts: string[] = await prov.request({ method: 'eth_requestAccounts' });
            if (accounts && accounts.length > 0) {
              const clean = setStoredMobileWalletAddress(accounts[0], 'Mobile Deep-Link');
              if (clean) {
                await connectWithFlowPulseConnector(clean);
              }
            }
          } catch (e) {}
        })();
      }
    }
  }, [mounted, isConnected, connectWithFlowPulseConnector]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setStatusMsg('');

    const trimmed = manualAddress.trim();
    if (!trimmed) {
      setErrorMsg('Inserisci o incolla il tuo indirizzo Wallet (0x...)');
      return;
    }

    if (!isAddress(trimmed)) {
      setErrorMsg('Indirizzo non valido. Deve iniziare con 0x ed essere di 42 caratteri.');
      return;
    }

    setIsConnectingWallet(true);
    try {
      const checksummed = setStoredMobileWalletAddress(trimmed, 'Wallet Mobile Aggiunto');
      if (checksummed) {
        await connectWithFlowPulseConnector(checksummed);
        setStatusMsg('Wallet aggiunto e collegato con successo!');
        setTimeout(() => {
          setIsModalOpen(false);
          setStatusMsg('');
        }, 500);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Errore durante il collegamento del wallet.');
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handlePasteClipboard = async () => {
    setErrorMsg('');
    try {
      if (navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setManualAddress(text.trim());
          if (isAddress(text.trim())) {
            setStatusMsg('Indirizzo rilevato dagli appunti! Premi "Aggiungi e Collega Wallet".');
          }
        }
      }
    } catch (e) {
      setErrorMsg('Tieni premuto nel campo di testo qui sopra e seleziona "Incolla".');
    }
  };

  const handleInstantMobileVault = async () => {
    setErrorMsg('');
    setIsConnectingWallet(true);
    try {
      const generated = generateOrGetInstantMobileAddress();
      setManualAddress(generated);
      await connectWithFlowPulseConnector(generated);
      setStatusMsg('Wallet Mobile Polygon attivato e collegato!');
      setTimeout(() => {
        setIsModalOpen(false);
        setStatusMsg('');
      }, 500);
    } catch (e) {
      setErrorMsg('Impossibile generare il wallet istantaneo.');
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleWalletAppClick = async (
    walletType: 'metamask' | 'trust' | 'coinbase' | 'phantom' | 'okx'
  ) => {
    setErrorMsg('');
    setStatusMsg('');
    setIsConnectingWallet(true);

    try {
      const prov = getAnyInjectedProvider();
      // 1. Se siamo già dentro il browser dell'app (o su PC con estensione), connetti subito via EIP-1193!
      if (prov) {
        const accounts: string[] = await prov.request({
          method: 'eth_requestAccounts',
        });
        if (accounts && accounts.length > 0) {
          const checksummed = setStoredMobileWalletAddress(accounts[0], walletType.toUpperCase());
          if (checksummed) {
            await connectWithFlowPulseConnector(checksummed);
            setIsModalOpen(false);
            setIsConnectingWallet(false);
            return;
          }
        }
      }

      // 2. Se siamo su Safari/Chrome mobile (senza window.ethereum), apri direttamente l'App del Wallet tramite Universal Deep-Link!
      if (typeof window !== 'undefined') {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('autoconnect', '1');
        const fullUrl = currentUrl.toString();
        const hostAndPath = fullUrl.replace(/^https?:\/\//, '');
        const origin = window.location.origin;

        let deepLink = '';
        if (walletType === 'metamask') {
          deepLink = `https://metamask.app.link/dapp/${hostAndPath}`;
        } else if (walletType === 'trust') {
          deepLink = `https://link.trustwallet.com/open_url?coin_id=60&url=${encodeURIComponent(fullUrl)}`;
        } else if (walletType === 'coinbase') {
          deepLink = `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(fullUrl)}`;
        } else if (walletType === 'phantom') {
          deepLink = `https://phantom.app/ul/browse/${encodeURIComponent(fullUrl)}?ref=${encodeURIComponent(origin)}`;
        } else if (walletType === 'okx') {
          deepLink = `https://www.okx.com/download?deeplink=${encodeURIComponent('okx://wallet/dapp/url?dappUrl=' + encodeURIComponent(fullUrl))}`;
        }

        if (deepLink) {
          setStatusMsg(
            `Apertura di ${walletType.toUpperCase()} in corso... Se preferisci restare in questo browser, incolla il tuo indirizzo 0x qui sopra!`
          );
          window.location.href = deepLink;
        }
      }
    } catch (err: any) {
      setErrorMsg(
        'Connessione annullata o app non rilevata. Puoi incollare direttamente il tuo indirizzo 0x qui sopra!'
      );
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleDisconnect = async () => {
    setStoredMobileWalletAddress(null);
    setStoredFallbackAddr(null);
    setManualAddress('');
    try {
      await disconnectAsync();
    } catch (e) {}
    setIsModalOpen(false);
  };

  const handleCopyAddress = () => {
    if (!effectiveAddress) return;
    navigator.clipboard?.writeText(effectiveAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortAddr = effectiveAddress
    ? `${effectiveAddress.slice(0, 6)}...${effectiveAddress.slice(-4)}`
    : '';

  const modalContent =
    isModalOpen && mounted
      ? createPortal(
          <div
            onClick={() => setIsModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(5, 7, 15, 0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              zIndex: 100000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              overflowY: 'auto',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '460px',
                background: 'linear-gradient(165deg, #131629 0%, #0b0d18 100%)',
                border: '1px solid rgba(0, 240, 255, 0.35)',
                borderRadius: '22px',
                padding: '22px',
                color: '#fff',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 30px rgba(0, 240, 255, 0.15)',
                maxHeight: '92vh',
                overflowY: 'auto',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>👛</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#00f0ff', fontWeight: 800 }}>
                      {effectiveConnected ? 'Il Tuo Wallet Polygon' : 'Aggiungi / Collega Wallet'}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Compatibile 100% con Cellulare (iOS / Android) e Desktop
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Se già connesso: mostra dettagli + possibilità di cambiare o disconnettere */}
              {effectiveConnected && effectiveAddress && (
                <div
                  style={{
                    background: 'rgba(0, 255, 136, 0.08)',
                    border: '1px solid rgba(0, 255, 136, 0.35)',
                    borderRadius: '14px',
                    padding: '14px',
                    marginBottom: '18px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', color: '#00ff88', fontWeight: 700 }}>
                      ● WALLET ATTIVO SU POLYGON
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700 }}>
                      {balanceData ? `${Number(balanceData.formatted).toFixed(4)} ${balanceData.symbol}` : 'Polygon Network'}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.82rem',
                      background: 'rgba(0,0,0,0.45)',
                      padding: '10px',
                      borderRadius: '8px',
                      wordBreak: 'break-all',
                      color: '#e2e8f0',
                      marginBottom: '10px',
                    }}
                  >
                    {effectiveAddress}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(0, 240, 255, 0.4)',
                        background: 'rgba(0, 240, 255, 0.12)',
                        color: '#00f0ff',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      {copied ? '✅ Copiato!' : '📋 Copia Indirizzo'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDisconnect}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 51, 102, 0.45)',
                        background: 'rgba(255, 51, 102, 0.15)',
                        color: '#ff4d79',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      🚪 Disconnetti
                    </button>
                  </div>
                </div>
              )}

              {/* METODO 1: INSERIMENTO DIRETTO INDIRIZZO WALLET (Ideale da Cellulare Safari/Chrome) */}
              <div
                style={{
                  background: 'rgba(27, 97, 255, 0.08)',
                  border: '1px solid rgba(0, 240, 255, 0.25)',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#00f0ff' }}>
                    📱 Aggiungi Indirizzo Wallet (Consigliato da Cellulare)
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                  Incolla il tuo indirizzo <strong>Polygon / Ethereum (0x...)</strong> da MetaMask, Trust Wallet, Coinbase o Binance per collegarlo subito senza uscire dal browser:
                </p>

                <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      placeholder="0x... (Incolla qui il tuo indirizzo Wallet)"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      style={{
                        flex: 1,
                        padding: '13px 12px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(0,0,0,0.55)',
                        color: '#fff',
                        fontSize: '0.9rem',
                        fontFamily: 'monospace',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handlePasteClipboard}
                      title="Incolla dagli appunti"
                      style={{
                        padding: '0 14px',
                        borderRadius: '10px',
                        border: '1px solid rgba(0, 240, 255, 0.35)',
                        background: 'rgba(0, 240, 255, 0.12)',
                        color: '#00f0ff',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      📋 Incolla
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isConnectingWallet}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(90deg, #00f0ff 0%, #1b61ff 100%)',
                      color: '#000',
                      fontWeight: 900,
                      fontSize: '0.98rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(0, 240, 255, 0.35)',
                    }}
                  >
                    {isConnectingWallet ? 'Collegamento in corso...' : '✅ Aggiungi e Collega Wallet'}
                  </button>
                </form>

                {/* Pulsante Rapido 1-Tap per chi non ha un indirizzo copiato */}
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={handleInstantMobileVault}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px dashed rgba(0, 255, 136, 0.45)',
                      background: 'rgba(0, 255, 136, 0.08)',
                      color: '#00ff88',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                    }}
                  >
                    ⚡ Non hai un indirizzo sottomano? Attiva Wallet Mobile Rapido (1-Tap)
                  </button>
                </div>
              </div>

              {/* Messaggi di stato o errore */}
              {errorMsg && (
                <div
                  style={{
                    background: 'rgba(255, 51, 102, 0.15)',
                    border: '1px solid rgba(255, 51, 102, 0.4)',
                    color: '#ff6b8b',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    marginBottom: '14px',
                  }}
                >
                  ⚠️ {errorMsg}
                </div>
              )}

              {statusMsg && (
                <div
                  style={{
                    background: 'rgba(0, 255, 136, 0.15)',
                    border: '1px solid rgba(0, 255, 136, 0.4)',
                    color: '#00ff88',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    marginBottom: '14px',
                  }}
                >
                  ✨ {statusMsg}
                </div>
              )}

              {/* METODO 2: CONNESSIONE CON APP WALLET MOBILE / ESTENSIONE */}
              <div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: '#94a3b8',
                    marginBottom: '10px',
                    fontWeight: 700,
                  }}
                >
                  Oppure collega direttamente la tua App Wallet:
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                  }}
                >
                  {[
                    { id: 'metamask', label: 'MetaMask', icon: '🦊', color: '#f6851b' },
                    { id: 'trust', label: 'Trust Wallet', icon: '🛡️', color: '#3375bb' },
                    { id: 'coinbase', label: 'Coinbase', icon: '🔵', color: '#0052ff' },
                    { id: 'phantom', label: 'Phantom', icon: '👻', color: '#ab9ff2' },
                    { id: 'okx', label: 'OKX Wallet', icon: '⚫', color: '#e2e8f0' },
                  ].map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => handleWalletAppClick(w.id as any)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.12)',
                        background: 'rgba(255,255,255,0.04)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{w.icon}</span>
                      <span>{w.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setErrorMsg('');
          setStatusMsg('');
          setIsModalOpen(true);
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: compact ? '6px' : '8px',
          padding: compact ? '8px 12px' : '11px 18px',
          borderRadius: '12px',
          border: effectiveConnected
            ? '1px solid rgba(0, 255, 136, 0.5)'
            : '1px solid rgba(0, 240, 255, 0.5)',
          background: effectiveConnected
            ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.18), rgba(0, 240, 255, 0.15))'
            : 'linear-gradient(90deg, #1b61ff 0%, #00c6ff 100%)',
          color: '#fff',
          fontWeight: 800,
          fontSize: compact ? '0.82rem' : '0.95rem',
          cursor: 'pointer',
          boxShadow: effectiveConnected
            ? '0 0 14px rgba(0, 255, 136, 0.25)'
            : '0 4px 14px rgba(27, 97, 255, 0.4)',
          whiteSpace: 'nowrap',
        }}
      >
        <span>{effectiveConnected ? '🟢' : '👛'}</span>
        <span>
          {effectiveConnected
            ? shortAddr
            : label || (compact ? 'Wallet' : 'Aggiungi Wallet')}
        </span>
      </button>
      {modalContent}
    </>
  );
}
