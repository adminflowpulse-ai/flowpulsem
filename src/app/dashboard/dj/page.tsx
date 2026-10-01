"use client";
import React, { useState, useRef } from 'react';
import Navbar from "@/components/Navbar";
import * as Tone from 'tone';
import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function DJDashboard() {
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const [activeTab, setActiveTab] = useState<'finance' | 'profile' | 'community' | 'live' | 'bookings'>('finance');
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

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      
      {!isConnected ? (
        <main style={{ flex: 1, padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ background: 'var(--surface-color)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', maxWidth: '700px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎧</div>
            <h2 style={{ fontSize: '2rem', color: 'var(--accent-blue)', marginBottom: '20px' }}>Il Tuo Studio Professionale</h2>
            <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' }}>
              Questa è la tua Dashboard DJ dove puoi gestire la tua intera carriera in modo decentralizzato.<br/><br/>
              Per accedere alla tua Vetrina, caricare Drop Musicali, avviare Live Room e iniziare a incassare senza intermediari, devi prima autenticarti connettendo il tuo <strong>Wallet Web3</strong>.
            </p>
            <div style={{ background: 'rgba(27, 97, 255, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(27, 97, 255, 0.1)', textAlign: 'left', marginBottom: '30px' }}>
              <h4 style={{ color: 'var(--accent-blue)', marginBottom: '10px' }}>✅ Perché ti serve un Wallet?</h4>
              <ul style={{ color: 'var(--text-muted)', lineHeight: '1.7', paddingLeft: '20px' }}>
                <li>È il tuo <strong>conto bancario personale Web3</strong>, i soldi arrivano direttamente a te.</li>
                <li>Ti permette di creare ed emettere i tuoi <strong>NFT Musicali (Drop)</strong>.</li>
                <li>È la tua <strong>chiave di accesso sicura</strong>, senza bisogno di password o dati sensibili.</li>
              </ul>
              <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid rgba(27, 97, 255, 0.2)" }}>
                <p style={{ color: "var(--text-main)", fontSize: "0.95rem" }}>💡 <em>Non hai ancora un wallet? Creare un account con <strong>MetaMask</strong> o <strong>Coinbase Wallet</strong> è gratis, facilissimo e richiede solo 2 minuti.</em></p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', border: '1px solid var(--accent-blue)', borderRadius: '16px', background: 'rgba(0,0,0,0.3)' }}>
              <ConnectButton />
            </div>
          </div>
        </main>
      ) : (
        <main style={{ flex: 1, padding: '2rem' }}>

        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>DJ Control Center</h1>
        <p style={{ color: 'var(--text-main)', marginBottom: '2rem' }}>La tua programmazione interna privata. Gestisci finanze, identità e community.</p>

        {/* Dashboard Navigation */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveTab('finance')}
            style={{ background: 'none', border: 'none', color: activeTab === 'finance' ? '#00f0ff' : 'var(--text-main)', fontWeight: activeTab === 'finance' ? 'bold' : 'normal', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            📊 Finanza & Liquidità
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{ background: 'none', border: 'none', color: activeTab === 'profile' ? '#00f0ff' : 'var(--text-main)', fontWeight: activeTab === 'profile' ? 'bold' : 'normal', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            👤 Profilo Artista & Vetrina
          </button>
          <button 
            onClick={() => setActiveTab('live')}
            style={{ background: 'none', border: 'none', color: activeTab === 'live' ? '#ff3366' : 'var(--text-main)', fontWeight: activeTab === 'live' ? 'bold' : 'normal', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            🔴 Live Rooms
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            style={{ background: 'none', border: 'none', color: activeTab === 'bookings' ? '#FFD700' : 'var(--text-main)', fontWeight: activeTab === 'bookings' ? 'bold' : 'normal', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            💎 Bookings (1-on-1)
          </button>
          <button 
            onClick={() => setActiveTab('community')}
            style={{ background: 'none', border: 'none', color: activeTab === 'community' ? '#00f0ff' : 'var(--text-main)', fontWeight: activeTab === 'community' ? 'bold' : 'normal', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            👥 Gestione Community
          </button>
        </div>

                {/* Tab Content: FINANCE */}
        {activeTab === 'finance' && (
          <>
            {/* ZERO COMMISSION BANNER */}
            <div style={{ background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.1), rgba(166, 74, 255, 0.1))', border: '1px solid #00f0ff', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ color: '#00f0ff', margin: '0 0 5px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.5rem' }}>???</span> Garanzia FlowPulseM: 0% Commissioni Artista
                </h3>
                <p style={{ color: 'var(--text-main)', margin: 0, fontSize: '0.95rem' }}>
                  L'utilizzo della piattaforma per te e' <b>gratuito al 100%</b>. Tutte le fee vengono applicate come ricarico direttamente all'acquirente. Il tuo incasso e' puro netto.
                </p>
              </div>
              <div style={{ background: '#00f0ff', color: '#000', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
                Fee DJ: 0%
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            
            {/* Main Wallet */}
            <div className="glass-panel" style={{ flex: '1 1 300px', padding: '2rem', borderTop: '4px solid #00f0ff' }}>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1rem' }}>SALDO TOTALE (WALLET)</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>42,500</span>
                <span style={{ color: '#00f0ff', fontWeight: 'bold' }}><img src="/coin.jpg" alt="FPM Coin" style={{ height: "1.2em", borderRadius: "50%", verticalAlign: "middle", margin: "0 5px" }} /></span>
              </div>
              <p style={{ color: '#00ff88', fontSize: '0.9rem' }}>+12.4% questa settimana</p>
              
              <button className="btn-primary" style={{ marginTop: '2rem', width: '100%' }}>Preleva Fondi</button>
            </div>

            {/* DJ Coin Status */}
            <div className="glass-panel" style={{ flex: '1 1 300px', padding: '2rem', borderTop: '4px solid #8a2be2' }}>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1rem' }}>LA TUA DJ COIN</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}><img src="/coin.jpg" alt="FPM Coin" style={{ height: "1.2em", borderRadius: "50%", verticalAlign: "middle", margin: "0 5px" }} /></span>
                <span style={{ fontSize: '1.5rem', color: '#00f0ff' }}>1.24 FPM</span>
              </div>
              <div style={{ marginTop: '1rem', height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'flex-end', padding: '5px', gap: '5px' }}>
                {/* Mock Chart */}
                <div style={{ flex: 1, background: '#8a2be2', height: '40%' }}></div>
                <div style={{ flex: 1, background: '#8a2be2', height: '50%' }}></div>
                <div style={{ flex: 1, background: '#8a2be2', height: '30%' }}></div>
                <div style={{ flex: 1, background: '#8a2be2', height: '70%' }}></div>
                <div style={{ flex: 1, background: '#8a2be2', height: '90%' }}></div>
                <div style={{ flex: 1, background: '#00f0ff', height: '100%' }}></div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '10px' }}>Market Cap: 142.5K FPM</p>
            </div>

            {/* Track Subcoins */}
            <div className="glass-panel" style={{ flex: '2 1 600px', padding: '2rem', borderTop: '4px solid #ff3366' }}>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1rem' }}>SUBCOIN DELLE TUE TRACCE</h3>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#888' }}>
                    <th style={{ padding: '10px' }}>Traccia</th>
                    <th style={{ padding: '10px' }}>Ticker</th>
                    <th style={{ padding: '10px' }}>Prezzo Attuale</th>
                    <th style={{ padding: '10px' }}>Holders</th>
                  </tr>
                </thead>
                <tbody><tr><td style={{ padding: "15px 10px", fontStyle: "italic", color: "#666", textAlign: "center" }} colSpan={4}>Nessuna traccia pubblicata</td></tr></tbody>
              </table>
            </div>

          </div>
          </>
        )}

        {/* Tab Content: PROFILE */}
        {activeTab === 'profile' && (
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div className="glass-panel" style={{ padding: '2rem', flex: 1, minWidth: '300px' }}>
              <h2 style={{ marginBottom: '2rem' }}>Personalizza Vetrina Pubblica</h2>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-main)' }}>Nome d'Arte</label>
                  <input type="text" placeholder="Nome Artista" style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-main)' }}>Biografia Web3</label>
                  <textarea rows={4} defaultValue="Techno Pioneer. The official Web3 vault." style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white' }} />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-main)' }}>Ticker DJ Coin Principale</label>
                    <input type="text" defaultValue="VINIL" style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-main)' }}>Genere Musicale</label>
                    <input type="text" defaultValue="Techno" style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white' }} />
                  </div>
                </div>

                <button type="button" className="btn-primary" style={{ padding: '15px', fontSize: '1.1rem', marginTop: '1rem', width: '200px' }}>Salva Profilo</button>
              </form>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Il tuo Merch (Physical + Digital Vault)</h2>
              <p style={{ color: 'var(--text-main)', marginBottom: '2rem' }}>Anteprima pubblica. Clicca il vinile per ascoltare.</p>
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
              <h3 style={{ margin: '0 0 10px 0' }}>Nessun EP in evidenza</h3>
              <p style={{ color: '#00f0ff', margin: '0 0 15px 0', fontWeight: 'bold' }}>Edizione Limitata Vinile</p>
            </div>
          </div>
        )}

        {/* Tab Content: COMMUNITY */}
        {activeTab === 'community' && (
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div className="glass-panel" style={{ flex: 2, padding: '2rem' }}>
              <h2 style={{ marginBottom: '1rem' }}>Nuovo Messaggio ai Fan</h2>
              <p style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Crea un post esclusivo. Solo chi detiene la tua <img src="/coin.jpg" alt="FPM Coin" style={{ height: "1.2em", borderRadius: "50%", verticalAlign: "middle", margin: "0 5px" }} /> Coin potrà leggerlo.</p>
              
              <textarea 
                placeholder="Scrivi un aggiornamento, condividi un link privato o un dietro le quinte..." 
                rows={5}
                style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white', marginBottom: '1rem' }}
              />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>📸 Allega Immagine</button>
                  <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>🎵 Allega Demo Audio</button>
                </div>
                <button className="btn-primary" style={{ padding: '10px 20px' }}>Pubblica ai Token Holders</button>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '3rem 0' }} />
              
              <h3 style={{ marginBottom: '1rem' }}>Post Precedenti</h3>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #00f0ff' }}>
                <span style={{ fontSize: '0.8rem', color: '#00f0ff', fontWeight: 'bold' }}>Esclusiva <img src="/coin.jpg" alt="FPM Coin" style={{ height: "1.2em", borderRadius: "50%", verticalAlign: "middle", margin: "0 5px" }} /> Holders</span>
                <p style={{ marginTop: '10px' }}>Grazie a tutti per aver mintato la nuova traccia! Sto lavorando al prossimo drop, preparate i wallet. Vi lascio qui un link per scaricare un sample pack gratuito della traccia.</p>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>Oggi, 14:30 - Visto da 850 fan</span>
              </div>
            </div>

            <div className="glass-panel" style={{ flex: 1, padding: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Statistiche Community</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                <span style={{ color: 'var(--text-main)' }}>Total Followers</span>
                <span style={{ fontWeight: 'bold' }}>12,450</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                <span style={{ color: 'var(--text-main)' }}>Attivi Oggi</span>
                <span style={{ fontWeight: 'bold', color: '#00ff88' }}>+342</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-main)' }}>Messaggi Letti</span>
                <span style={{ fontWeight: 'bold' }}>82%</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: LIVE ROOMS */}
        {activeTab === 'live' && (
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', border: '2px solid #ff3366', boxShadow: '0 0 20px rgba(255,51,102,0.2)' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#ff3366' }}>🔴 Live Rooms (Listening Parties)</h2>
            <p style={{ color: 'var(--text-main)', marginBottom: '2rem' }}>Fai ascoltare le tue tracce in anteprima esclusiva ai tuoi possessori di Token. Nessun link esterno, tutto in-app.</p>
            
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-main)' }}>Titolo dell'Evento Live</label>
                <input type="text" placeholder="Es. Ascolto del nuovo EP in lavorazione..." style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,51,102,0.5)', background: 'rgba(0,0,0,0.5)', color: 'white' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-main)' }}>Token Gate (Requisito di Accesso)</label>
                <select style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white' }}>
                  <option>Holders di <img src="/coin.jpg" alt="FPM Coin" style={{ height: "1.2em", borderRadius: "50%", verticalAlign: "middle", margin: "0 5px" }} /> (Qualsiasi quantità)</option>
                  <option>Holders di <img src="/coin.jpg" alt="FPM Coin" style={{ height: "1.2em", borderRadius: "50%", verticalAlign: "middle", margin: "0 5px" }} />-DRK (Traccia Singola)</option>
                  <option>VIP Solo Top 10% Holders</option>
                </select>
              </div>
            </form>

            <button 
              onClick={() => alert("Sei ON AIR! I fan riceveranno la notifica per entrare.")}
              style={{ width: '100%', padding: '20px', background: 'linear-gradient(45deg, #ff3366, #ff0000)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 20px rgba(255,0,0,0.5)' }}>
              🔴 GO LIVE NOW
            </button>
          </div>
        )}

        {/* Tab Content: BOOKINGS (1-on-1) */}
        {activeTab === 'bookings' && (
          <div style={{ maxWidth: '900px' }}>
            <h2 style={{ marginBottom: '1rem', color: '#FFD700' }}>💎 Gestione Bookings 1-on-1</h2>
            <p style={{ color: 'var(--text-main)', marginBottom: '2rem' }}>Le richieste dei tuoi Superfan di livello Diamond. Trattieni il 100% dell'incasso.</p>
            
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: '4px solid #FFD700' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0 }}>TechnoFan_99</h3>
                    <span style={{ background: '#FFD700', color: 'black', padding: '3px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>💎 DIAMOND FAN</span>
                  </div>
                  <p style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}><strong>Richiesta:</strong> Ascolto & Feedback Tracce (1 Ora)</p>
                  <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem' }}>
                    <p style={{ margin: 0, fontStyle: 'italic', color: '#ddd' }}>"Ciao VINIL! Sono un tuo fan storico. Vorrei farti ascoltare il mio ultimo EP techno e ricevere qualche tuo consiglio sulle frequenze basse. Grazie!"</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right', minWidth: '150px' }}>
                  <p style={{ margin: '0 0 5px 0', color: 'var(--text-main)', fontSize: '0.9rem' }}>Netto per te:</p>
                  <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#00ff88' }}>500 <img src="/coin.jpg" alt="FPM Coin" style={{ height: "1.2em", borderRadius: "50%", verticalAlign: "middle", margin: "0 5px" }} /></p>
                  <p style={{ margin: '5px 0 0 0', color: 'var(--text-main)', fontSize: '0.8rem' }}>I fondi sono già bloccati.</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button 
                  onClick={() => {
                    const win = window.open('/meet', '_blank');
                    if(win) win.focus();
                  }}
                  style={{ flex: 1, padding: '15px', background: '#00ff88', color: 'black', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}
                >
                  ✅ Accetta & Avvia Video Call
                </button>
                <button style={{ padding: '15px 30px', background: 'transparent', color: '#ff3366', border: '1px solid #ff3366', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  âŒ Rifiuta (Rimborsa Fan)
                </button>
              </div>
            </div>
            
            <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>Storico Sessioni</h3>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem 2rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>BerghainLover</strong> - Masterclass
                <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: 'var(--text-main)' }}>Completata: 2 Set 2026</p>
              </div>
              <span style={{ color: '#00ff88', fontWeight: 'bold' }}>+ 500 <img src="/coin.jpg" alt="FPM Coin" style={{ height: "1.2em", borderRadius: "50%", verticalAlign: "middle", margin: "0 5px" }} /></span>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}




