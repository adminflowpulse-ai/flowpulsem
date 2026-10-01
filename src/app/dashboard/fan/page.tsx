"use client";
import React, { useState, useRef } from 'react';
import Navbar from "@/components/Navbar";
import * as Tone from 'tone';
import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function FanDashboard() {
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address });
  
  const [activeTab, setActiveTab] = useState<'collection' | 'feed' | 'wallet' | 'phygital' | 'diamond'>('collection');
  const [isPlayingVinyl, setIsPlayingVinyl] = useState(false);
  const synthRef = useRef<Tone.FMSynth | null>(null);
  const loopRef = useRef<Tone.Loop | null>(null);

  const playVinylMusic = async () => {
    await Tone.start();
    
    if (isPlayingVinyl) {
      Tone.Transport.stop();
      setIsPlayingVinyl(false);
      return;
    }

    if (!synthRef.current) {
      const synth = new Tone.FMSynth().toDestination();
      synthRef.current = synth;
      const loop = new Tone.Loop((time) => {
        synth.triggerAttackRelease("C2", "8n", time);
      }, "4n");
      loopRef.current = loop;
    }

    Tone.Transport.bpm.value = 125;
    Tone.Transport.start();
    loopRef.current?.start(0);
    setIsPlayingVinyl(true);
  };

  // Mock Collection Data
  const collection: any[] = [];

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      
      {!isConnected ? (
        <main style={{ flex: 1, padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ background: 'var(--surface-color)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', maxWidth: '700px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎵</div>
            <h2 style={{ fontSize: '2rem', color: 'var(--accent-green)', marginBottom: '20px' }}>Benvenuto nel Tuo Spazio Fan</h2>
            <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' }}>
              Questa è la tua Dashboard personale dove puoi esplorare, ascoltare e collezionare la musica che ami.<br/><br/>
              <strong>Ma FlowPulseM non è un semplice player musicale.</strong><br/><br/>
              Per sbloccare il vero potenziale della piattaforma (acquistare proprietà delle tracce, votare le decisioni degli artisti, e ricevere <em>Royalty automatiche</em> sui tuoi ascolti), devi connettere il tuo <strong>Wallet Web3</strong>.
            </p>
            <div style={{ background: 'rgba(0, 255, 136, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(0, 255, 136, 0.1)', textAlign: 'left', marginBottom: '30px' }}>
              <h4 style={{ color: 'var(--accent-green)', marginBottom: '10px' }}>✅ Perché è essenziale il Wallet?</h4>
              <ul style={{ color: 'var(--text-muted)', lineHeight: '1.7', paddingLeft: '20px' }}>
                <li>È il tuo <strong>conto sicuro e anonimo</strong> (nessuna banca o intermediario di mezzo)</li>
                <li>Custodisce la vera <strong>proprietà digitale</strong> delle tue tracce musicali (NFT)</li>
                <li>Permette di ricevere automaticamente le tue <strong>FPM Coin (Royalty)</strong> in tempo reale</li>
              </ul>
              <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid rgba(0, 255, 136, 0.2)" }}>
                <p style={{ color: "var(--text-main)", fontSize: "0.95rem" }}>💡 <em>Non hai un wallet? Aprire <strong>MetaMask</strong> o <strong>Coinbase Wallet</strong> è completamente gratuito, facilissimo e richiede solo 2 minuti.</em></p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', border: '1px solid var(--accent-green)', borderRadius: '16px', background: 'rgba(0,0,0,0.3)' }}>
              <ConnectButton />
            </div>
          </div>
        </main>
      ) : (
        <main style={{ flex: 1, padding: '2rem' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(45deg, #00f0ff, #fff)', position: 'relative', boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)' }}>
            <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', background: 'linear-gradient(90deg, #00f0ff, #8a2be2)', color: 'white', fontWeight: 'bold', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem', border: '2px solid white' }}>
              💎 DIAMOND TIER
            </div>
          </div>
          <div>
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 5px 0' }}>TechnoFan_99</h1>
            <p style={{ color: 'var(--text-main)', margin: 0 }}>Membro dal 2026 • 3 Token in Collezione</p>
            <div style={{ marginTop: '10px', width: '300px', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '100%', background: 'linear-gradient(90deg, #00f0ff, #fff)', height: '100%' }}></div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#00f0ff', marginTop: '5px', fontWeight: 'bold' }}>MAX RANK REACHED! 1-on-1 Experiences Unlocked.</p>
          </div>
        </div>

        {/* Dashboard Navigation */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('collection')}
            style={{ background: 'none', border: 'none', color: activeTab === 'collection' ? '#00f0ff' : 'var(--text-main)', fontWeight: activeTab === 'collection' ? 'bold' : 'normal', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            🎧 La Mia Collezione
          </button>
          <button 
            onClick={() => setActiveTab('feed')}
            style={{ background: 'none', border: 'none', color: activeTab === 'feed' ? '#00f0ff' : 'var(--text-main)', fontWeight: activeTab === 'feed' ? 'bold' : 'normal', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            📺 Feed Esclusivo & Live Rooms
          </button>
          <button 
            onClick={() => setActiveTab('phygital')}
            style={{ background: 'none', border: 'none', color: activeTab === 'phygital' ? '#FFD700' : 'var(--text-main)', fontWeight: activeTab === 'phygital' ? 'bold' : 'normal', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            📀 Merch (Phygital)
          </button>
          <button 
            onClick={() => setActiveTab('diamond')}
            style={{ background: 'none', border: 'none', color: activeTab === 'diamond' ? '#00f0ff' : 'var(--text-main)', fontWeight: activeTab === 'diamond' ? 'bold' : 'normal', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textShadow: activeTab === 'diamond' ? '0 0 10px rgba(0,240,255,0.5)' : 'none' }}
          >
            💎 Diamond Experiences
          </button>
          <button 
            onClick={() => setActiveTab('wallet')}
            style={{ background: 'none', border: 'none', color: activeTab === 'wallet' ? '#00f0ff' : 'var(--text-main)', fontWeight: activeTab === 'wallet' ? 'bold' : 'normal', fontSize: '1.2rem', cursor: 'pointer', marginLeft: 'auto' }}
          >
            💰 Wallet Utente
          </button>
        </div>

        {/* Tab Content: COLLECTION */}
        {activeTab === 'collection' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Musica Acquistata (Web3 Vault)</h2>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {collection.map(item => (
                <div key={item.id} className="glass-panel" style={{ width: '280px', padding: '1.5rem', transition: 'transform 0.2s', cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
                  <img src={item.cover} alt={item.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.1rem', margin: '0 0 5px 0' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-main)', margin: '0 0 10px 0', fontSize: '0.9rem' }}>{item.artist}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ fontSize: '0.8rem', color: '#00f0ff', fontWeight: 'bold', padding: '4px 8px', background: 'rgba(0, 240, 255, 0.1)', borderRadius: '4px' }}>{item.token}</span>
                    <button style={{ background: 'var(--accent-gradient)', border: 'none', borderRadius: '50%', width: '35px', height: '35px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', cursor: 'pointer' }}>▶</button>
                  </div>

                  {/* DAW Bridge Button */}
                  {item.stems && (
                    <button 
                      onClick={() => window.open('/studio', '_blank')}
                      style={{ width: '100%', marginTop: '1rem', padding: '10px', background: 'rgba(138, 43, 226, 0.2)', border: '1px solid var(--accent-primary)', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                      ðŸŽ›ï¸ Open Stems in DAW
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: FEED */}
        {activeTab === 'feed' && (
          <div style={{ maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Aggiornamenti & Live Rooms dai tuoi DJ</h2>
            
            {/* Live Room Notification */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem', border: '2px solid #ff3366', animation: 'pulse-border 2s infinite' }}>
              <style>{`
                @keyframes pulse-border {
                  0% { box-shadow: 0 0 0 0 rgba(255, 51, 102, 0.7); }
                  70% { box-shadow: 0 0 0 10px rgba(255, 51, 102, 0); }
                  100% { box-shadow: 0 0 0 0 rgba(255, 51, 102, 0); }
                }
              `}</style>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#ff3366', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', fontSize: '0.6rem', padding: '2px 5px', borderRadius: '10px', fontWeight: 'bold' }}>LIVE</span>
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>Nessun evento Live</h3>
                    <p style={{ margin: '5px 0 0 0', color: 'var(--text-main)', fontSize: '0.9rem' }}>Listening Party: Secret Unreleased Tracks</p>
                  </div>
                </div>
                <button style={{ background: '#ff3366', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 15px rgba(255, 51, 102, 0.5)' }}>
                  🎧 Entra nel Club (VIP Only)
                </button>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1rem', borderLeft: '4px solid #8a2be2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#8a2be2' }}></div>
                  <div>
                    <h4 style={{ margin: 0 }}>Seleziona Artista</h4>
                    <span style={{ fontSize: '0.8rem', color: '#00f0ff', fontWeight: 'bold' }}>Solo per i possessori di <img src="/coin.jpg" alt="FPM Coin" style={{ height: "1.2em", borderRadius: "50%", verticalAlign: "middle", margin: "0 5px" }} /></span>
                  </div>
                </div>
                <span style={{ color: 'var(--text-main)', fontSize: '0.8rem' }}>2 ore fa</span>
              </div>
              <p>Grazie a tutti per aver mintato la nuova traccia! Sto lavorando al prossimo drop, preparate i wallet. Vi lascio qui un link per scaricare un sample pack gratuito della traccia.</p>
              <button style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', color: 'white', borderRadius: '20px', cursor: 'pointer' }}>🔗 Scarica Sample Pack</button>
            </div>
          </div>
        )}

        {/* Tab Content: PHYGITAL */}
        {activeTab === 'phygital' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Il tuo Merch (Physical + Digital Vault)</h2>
            <p style={{ color: 'var(--text-main)', marginBottom: '3rem' }}>I token associati ad articoli fisici reali ti garantiscono la proprietà dell'NFT 3D corrispondente. Clicca il vinile per suonarlo!</p>
            
            <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div className="glass-panel" style={{ padding: '3rem', width: '350px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <style>{`
                  @keyframes spin-record {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                `}</style>
                
                {/* Record Player Container */}
                <div style={{ 
                  position: 'relative', width: '280px', height: '280px', background: 'linear-gradient(135deg, #2a2a2a, #111)', 
                  borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  boxShadow: '0 15px 35px rgba(0,0,0,0.9), inset 0 2px 5px rgba(255,255,255,0.1)',
                  marginBottom: '2rem',
                  border: '1px solid #333'
                }}>
                  {/* The Vinyl Disc */}
                  <div 
                    onClick={playVinylMusic}
                    style={{ 
                      width: '240px', height: '240px', borderRadius: '50%', 
                      background: 'repeating-radial-gradient(#0a0a0a 0, #0a0a0a 2px, #1a1a1a 3px, #0a0a0a 4px)',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.8), inset 0 0 10px rgba(0,0,0,1)', 
                      position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center',
                      animation: isPlayingVinyl ? 'spin-record 1.8s linear infinite' : 'none',
                      cursor: 'pointer',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Light Reflection Overlay (static relative to the vinyl to simulate realistic shine) */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      background: 'conic-gradient(from 45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 15%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.15) 65%, rgba(255,255,255,0) 80%)',
                      pointerEvents: 'none',
                      mixBlendMode: 'screen'
                    }}></div>
                    
                    {/* Record Label */}
                    <div style={{ width: '85px', height: '85px', borderRadius: '50%', background: 'url(https://via.placeholder.com/150/000000/00f0ff?text=DARK+ROOM)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 8px rgba(0,0,0,0.8)' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ddd', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.8)' }}></div>
                    </div>
                  </div>

                  {/* Tonearm (Braccetto) */}
                  <div style={{
                    position: 'absolute', top: '15px', right: '15px', width: '30px', height: '160px',
                    transformOrigin: '15px 15px',
                    transform: isPlayingVinyl ? 'rotate(35deg)' : 'rotate(0deg)',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    pointerEvents: 'none',
                    zIndex: 10,
                    filter: 'drop-shadow(-5px 10px 5px rgba(0,0,0,0.5))'
                  }}>
                    {/* Tonearm Base Pivot */}
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'radial-gradient(circle, #eee, #888)', border: '2px solid #222' }}></div>
                    {/* Tonearm Rod */}
                    <div style={{ width: '8px', height: '120px', background: 'linear-gradient(90deg, #999, #eee, #666)', margin: '0 auto', marginTop: '-5px', borderRadius: '4px' }}></div>
                    {/* Tonearm Headshell */}
                    <div style={{ width: '18px', height: '28px', background: 'linear-gradient(135deg, #444, #111)', margin: '0 auto', borderRadius: '2px', transform: 'rotate(25deg) translateY(-5px)', transformOrigin: 'top center', border: '1px solid #555' }}>
                       <div style={{ width: '4px', height: '4px', background: 'red', borderRadius: '50%', margin: '20px auto 0 auto' }}></div>
                    </div>
                  </div>
                </div>

                <h3 style={{ margin: '0 0 10px 0' }}>Nessun VINIL 3D disponibile</h3>
                <p style={{ color: '#00f0ff', margin: '0 0 15px 0', fontWeight: 'bold' }}>Limited Edition Vinyl #42/100</p>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', fontSize: '0.9rem', color: '#aaa', width: '100%' }}>
                  Stato Spedizione: <span style={{ color: '#00ff88' }}>Consegnato</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: DIAMOND EXPERIENCES */}
        {activeTab === 'diamond' && (
          <div style={{ maxWidth: '900px' }}>
            <h2 style={{ marginBottom: '1rem', color: '#00f0ff', textShadow: '0 0 10px rgba(0,240,255,0.5)' }}>💎 Privilegi Diamond: 1-on-1 Experiences</h2>
            <p style={{ color: 'var(--text-main)', marginBottom: '2rem', fontSize: '1.1rem' }}>
              Essendo nel Top 1% dei supporter, hai sbloccato l'accesso diretto ai tuoi idoli. 
              Richiedi una Masterclass, un Feedback sulle tue tracce o una Chiacchierata privata in Video Call.
            </p>

            <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(0, 240, 255, 0.3)', boxShadow: '0 0 30px rgba(0, 240, 255, 0.1)' }}>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Nuova Richiesta</h3>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)' }}>Seleziona DJ</label>
                    <select style={{ width: '100%', padding: '15px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1rem' }}>
                      <option>Seleziona Artista</option>
                      <option>Nessun altro artista</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)' }}>Tipo di Esperienza (1 Ora)</label>
                    <select style={{ width: '100%', padding: '15px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1rem' }}>
                      <option>Masterclass di Produzione</option>
                      <option>Ascolto & Feedback Tracce (A&R)</option>
                      <option>Chiacchierata Privata</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)' }}>Note per il DJ</label>
                    <textarea rows={3} placeholder="Es. Vorrei farti ascoltare il mio ultimo EP techno..." style={{ width: '100%', padding: '15px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1rem' }}></textarea>
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: '300px', background: 'rgba(0,0,0,0.4)', padding: '2rem', borderRadius: '10px' }}>
                  <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Preventivo Booking</h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--text-main)' }}>Tariffa DJ (100% all'artista):</span>
                    <span style={{ fontWeight: 'bold' }}>500.00 <img src="/coin.jpg" alt="FPM Coin" style={{ height: "1.2em", borderRadius: "50%", verticalAlign: "middle", margin: "0 5px" }} /></span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                    <span style={{ color: 'var(--text-main)' }}>Fee Piattaforma (10% a carico dell'acquirente):</span>
                    <span style={{ fontWeight: 'bold', color: '#ff3366' }}>+ 50.00 <img src="/coin.jpg" alt="FPM Coin" style={{ height: "1.2em", borderRadius: "50%", verticalAlign: "middle", margin: "0 5px" }} /></span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.5rem' }}>
                    <span>Totale:</span>
                    <span style={{ fontWeight: 'bold', color: '#00f0ff' }}>550.00 <img src="/coin.jpg" alt="FPM Coin" style={{ height: "1.2em", borderRadius: "50%", verticalAlign: "middle", margin: "0 5px" }} /></span>
                  </div>

                  <button 
                    onClick={() => { alert('Richiesta inviata allo Smart Contract! In attesa di approvazione dal DJ.'); }}
                    style={{ width: '100%', padding: '20px', background: 'linear-gradient(90deg, #00f0ff, #8a2be2)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)' }}
                  >
                    Invia Richiesta & Blocca Fondi
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '1rem' }}>
                    I fondi verranno bloccati nello Smart Contract. Se il DJ rifiuta, verranno rimborsati istantaneamente.
                  </p>
                </div>
              </div>
            </div>
            
            <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>Richieste in Sospeso</h3>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem 2rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Seleziona Artista</strong> - Ascolto & Feedback Tracce
                <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: 'var(--text-main)' }}>Inviata il: 11 Set 2026</p>
              </div>
              <span style={{ background: 'rgba(255, 215, 0, 0.2)', color: '#FFD700', padding: '5px 15px', borderRadius: '15px', fontSize: '0.9rem', fontWeight: 'bold' }}>â³ In attesa di Risposta</span>
            </div>
          </div>
        )}

        {/* Tab Content: WALLET */}
        {activeTab === 'wallet' && (
          <div className="glass-panel" style={{ maxWidth: '600px', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Il tuo Saldo</h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '2rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{isConnected ? (balanceData?.formatted || "0.00") : "0.00"}</span>
              <span style={{ color: '#00f0ff', fontWeight: 'bold', fontSize: '1.5rem' }}>{isConnected ? (balanceData?.symbol || "$FPM") : "$FPM"}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-primary" style={{ flex: 1, padding: '15px' }}>Acquista <img src="/coin.jpg" alt="FPM Coin" style={{ height: "1.2em", borderRadius: "50%", verticalAlign: "middle", margin: "0 5px" }} /></button>
              <button style={{ flex: 1, padding: '15px', background: 'transparent', border: '1px solid var(--accent-primary)', color: 'white', borderRadius: '8px' }}>Preleva</button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}



