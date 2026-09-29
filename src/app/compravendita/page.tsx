"use client";
import React, { useState } from 'react';
import Navbar from "@/components/Navbar";

// Mock data for secondary market listings
const SECONDARY_MARKET_TRACKS: any[] = [];

export default function CompravenditaPage() {
  const [buyerName, setBuyerName] = useState('');
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleBuy = async (listing: any) => {
    setSelectedListing(listing);
    setDownloadUrl('');
  };

  const confirmPurchase = async () => {
    if (!buyerName) {
      alert("Per favore, inserisci il tuo nome per il certificato SIAE.");
      return;
    }
    
    setIsProcessing(true);

    try {
      // Simulate Smart Contract Transaction...
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call API to generate PDF
      const response = await fetch('/api/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerName,
          artistName: selectedListing.artist,
          trackTitle: selectedListing.title,
          trackId: selectedListing.trackId
        })
      });

      if (!response.ok) throw new Error("Errore durante la generazione del certificato.");

      // Create a Blob from the PDF Stream
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);

    } catch (error) {
      console.error(error);
      alert("Si è verificato un errore durante l'acquisto.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '1rem', paddingBottom: '120px' }}>
      <Navbar />

      <main style={{ marginTop: '2rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', margin: 0 }}>Camera di <span className="text-gradient">Compravendita</span></h1>
          <p style={{ color: 'var(--text-main)', marginTop: '10px' }}>Acquista e vendi tracce tra privati. Ogni acquisto include il rilascio automatico del certificato SIAE nominale.</p>
        </div>

        {selectedListing && !downloadUrl && (
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem', border: '1px solid var(--accent-primary)' }}>
            <h2>Stai acquistando: {selectedListing.title} di {selectedListing.artist}</h2>
            <p>Prezzo: {selectedListing.price} <img src="/coin.jpg" alt="FPM Coin" style={{ height: "1.2em", borderRadius: "50%", verticalAlign: "middle", margin: "0 5px" }} /></p>
            <p>Venditore: {selectedListing.seller}</p>
            
            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Nome e Cognome per il Certificato SIAE (Obbligatorio):</label>
              <input 
                type="text" 
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Es. Mario Rossi"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white', marginBottom: '1rem' }}
              />
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn-primary" 
                  onClick={confirmPurchase} 
                  disabled={isProcessing}
                  style={{ padding: '12px 24px', opacity: isProcessing ? 0.7 : 1 }}
                >
                  {isProcessing ? 'Elaborazione Transazione...' : 'Conferma e Genera SIAE'}
                </button>
                <button 
                  onClick={() => setSelectedListing(null)}
                  style={{ padding: '12px 24px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        )}

        {downloadUrl && (
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem', border: '1px solid #00f0ff', textAlign: 'center' }}>
            <h2 style={{ color: '#00f0ff' }}>Acquisto Completato con Successo! ðŸŽ‰</h2>
            <p style={{ margin: '1rem 0' }}>La traccia è stata trasferita al tuo wallet. Il tuo certificato SIAE nominale è pronto.</p>
            <a href={downloadUrl} download={`SIAE_Certificato_${selectedListing?.title}.pdf`}>
              <button className="btn-primary" style={{ padding: '12px 24px', background: '#00f0ff', color: '#000' }}>
                Scarica Certificato SIAE (PDF)
              </button>
            </a>
            <button 
                onClick={() => { setSelectedListing(null); setDownloadUrl(''); setBuyerName(''); }}
                style={{ display: 'block', margin: '1rem auto 0', background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Torna al Marketplace
            </button>
          </div>
        )}

        {!selectedListing && !downloadUrl && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {SECONDARY_MARKET_TRACKS.map(listing => (
              <div key={listing.listingId} className="glass-panel track-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%', height: '140px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '4rem' }}>ðŸ¤</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{listing.title}</h3>
                <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '8px' }}>{listing.artist}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
                  Venditore: {listing.seller}
                </p>
                
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-secondary)' }}>{listing.price} <img src="/coin.jpg" alt="FPM Coin" style={{ height: "1.2em", borderRadius: "50%", verticalAlign: "middle", margin: "0 5px" }} /></span>
                  <button className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.8rem' }} onClick={() => handleBuy(listing)}>
                    Acquista
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

