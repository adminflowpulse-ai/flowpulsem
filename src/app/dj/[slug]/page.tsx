"use client";
import React from 'react';
import Navbar from "@/components/Navbar";
import MarketChart from "@/components/MarketChart";
import { useParams } from 'next/navigation';

export default function DjProfile() {
  const params = useParams();
  const djName = params?.slug ? (params.slug as string).replace('-', ' ').toUpperCase() : 'DJ SCONOSCIUTO';

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '1rem', paddingBottom: '120px' }}>
      <Navbar />

      {/* Header Artista Premium */}
      <div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: '20px', overflow: 'hidden', marginBottom: '3rem', background: 'var(--surface-color)', display: 'flex', alignItems: 'flex-end', padding: '2rem' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(18,20,28,1), rgba(18,20,28,0))', zIndex: 1 }}></div>
        <div style={{ zIndex: 2, display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '4rem', margin: 0, lineHeight: 1 }}>{djName}</h1>
            <p style={{ color: 'var(--accent-secondary)', fontSize: '1.2rem', marginTop: '10px' }}>15.2M $FPM Market Cap • 1.2M Followers</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" style={{ padding: '10px 30px' }}>Invest in DJ Token</button>
            <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--text-main)', color: 'var(--text-main)' }}>Follow</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '3rem', flexDirection: 'row' }}>
        
        {/* Colonna Sinistra (Blog e Social Feed) */}
        <div style={{ flex: 2 }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Exclusive Updates</h3>
          
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
              <div>
                <h4 style={{ margin: 0 }}>{djName}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>2 hours ago</span>
              </div>
            </div>
            <p style={{ lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Just dropped my new EP exclusively on FlowPulseM! The first 100 people to buy the token will get VIP backstage access to my next show in Ibiza. Let's build this new economy together! 🎵🔥
            </p>
            <img src="https://images.unsplash.com/photo-1571266028243-cb40fce75729?q=80&w=800&auto=format&fit=crop" alt="DJ Set" style={{ width: '100%', borderRadius: '12px', marginBottom: '1rem' }} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', fontWeight: 'bold' }}>❤️ 4.2k</button>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>💬 342 Comments</button>
            </div>
          </div>
        </div>

        {/* Colonna Destra (Dati Finanziari e Tracks) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>DJ Token Performance</h4>
            <MarketChart />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '1rem', textAlign: 'center' }}>
              Marketing Automatico Attivo: Algoritmo di segnalazione Web3 in esecuzione... 🟢
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Top Tracks & Stems</h4>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '30px', height: '30px', background: 'var(--accent-secondary)', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {i === 2 ? '🎛️' : '🎵'}
                  </div>
                  <span style={{ fontSize: '0.9rem' }}>{i === 2 ? `Track ${i} (Vocal Stem)` : `Track ${i}`}</span>
                </div>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>0.0{i} $FPM</span>
              </div>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--accent-primary)', background: 'rgba(138, 43, 226, 0.05)' }}>
            <h4 style={{ marginBottom: '5px', fontSize: '1.2rem', color: 'var(--text-highlight)' }}>🎟️ Live Tour Tickets</h4>
            <p style={{ fontSize: '0.8rem', color: '#00ff00', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>🛡️</span> Protected by Anti-Scalp Smart Contract
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold' }}>Amnesia, Ibiza</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main)' }}>15 Aug 2026 • Native Web3 Ticket</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <button className="btn-primary" style={{ padding: '5px 15px', fontSize: '0.8rem', marginBottom: '5px' }}>10 $FPM</button>
                <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-main)' }}>Max Resale: 10 $FPM</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold' }}>Tomorrowland, Boom</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: 0 }}>
                  <span style={{ fontSize: '0.7rem', background: '#e1306c', padding: '2px 6px', borderRadius: '4px', color: 'white' }}>Wrapped Web2</span>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main)' }}>22 Aug 2026</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <button className="btn-primary" style={{ padding: '5px 15px', fontSize: '0.8rem', background: 'var(--surface-color)', marginBottom: '5px' }}>Fiat or 15 $FPM</button>
                <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-main)' }}>Auto-Purchased via API</p>
              </div>
            </div>
            
            <p style={{ fontSize: '0.7rem', color: 'var(--accent-secondary)', marginTop: '1rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
              I biglietti nativi non possono essere rivenduti a prezzo maggiorato. <br/> Il bagarinaggio è matematicamente impossibile.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid #FFD700', background: 'rgba(255, 215, 0, 0.05)', marginTop: '2rem' }}>
            <h4 style={{ marginBottom: '5px', fontSize: '1.2rem', color: '#FFD700' }}>👑 Ultra-VIP Web3 Experience</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
              Vivi l'evento da una prospettiva milionaria.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold' }}>Tavolo in Console con {djName}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main)' }}>Accesso Backstage, Drink Premium e Meet & Greet Esclusivo</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '1rem', background: 'linear-gradient(90deg, #FFD700, #FFA500)', color: '#000', fontWeight: 'bold' }}>15.000 $FPM</button>
                <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-main)', marginTop: '5px' }}>Cryptographic VIP Pass (QR)</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
