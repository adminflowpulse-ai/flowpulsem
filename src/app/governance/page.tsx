"use client";
import React, { useState } from 'react';
import Navbar from "@/components/Navbar";

export default function GovernancePage() {
  const [stakedAmount, setStakedAmount] = useState('0');
  
  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '1rem', paddingBottom: '120px' }}>
      <Navbar />

      <main style={{ marginTop: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Decentralized <span className="text-gradient">Governance (DAO)</span></h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', maxWidth: '700px', margin: '0 auto' }}>
            FlowPulseM appartiene a chi lo usa. Metti in stake i tuoi $FPM per ottenere Potere di Voto. Scegli le prossime release, approva i fondi per i tour dei DJ emergenti e guida la piattaforma.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexDirection: 'row' }}>
          
          {/* Dashboard Staking */}
          <div className="glass-panel" style={{ flex: 1, padding: '2rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#FFD700' }}>Your Voting Power</h3>
            <div style={{ background: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#FFD700' }}>1,450</span>
              <p style={{ margin: 0, color: 'var(--text-main)' }}>vFPM (Votes)</p>
            </div>
            
            <h4 style={{ marginBottom: '1rem' }}>Stake $FPM</h4>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
              <input 
                type="number" 
                placeholder="Amount to stake" 
                value={stakedAmount}
                onChange={e => setStakedAmount(e.target.value)}
                style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '8px' }}
              />
              <button className="btn-primary" style={{ background: '#FFD700', color: '#000', fontWeight: 'bold' }}>Stake</button>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>Available Balance: 5,200 $FPM</p>
          </div>

          {/* Active Proposals */}
          <div style={{ flex: 2 }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Active Proposals</h3>
            
            {/* Proposta 1 */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem', borderLeft: '4px solid #00f0ff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', margin: '0 0 10px 0' }}>FIP-12: Finanziare il Tour Europeo di "DJ Novus"</h4>
                  <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.9rem' }}>Richiesta di allocare 50.000 $FPM dalla Treasury della piattaforma per supportare il tour promozionale.</p>
                </div>
                <span style={{ background: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>Active - Ends in 2 Days</span>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.8rem' }}>
                  <span style={{ color: '#00ff00' }}>For (75%)</span>
                  <span style={{ color: '#ff007f' }}>Against (25%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: '75%', height: '100%', background: '#00ff00' }}></div>
                  <div style={{ width: '25%', height: '100%', background: '#ff007f' }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-primary" style={{ flex: 1, background: 'rgba(0, 255, 0, 0.2)', border: '1px solid #00ff00', color: '#00ff00' }}>Vote FOR</button>
                <button className="btn-primary" style={{ flex: 1, background: 'rgba(255, 0, 127, 0.2)', border: '1px solid #ff007f', color: '#ff007f' }}>Vote AGAINST</button>
              </div>
            </div>

            {/* Proposta 2 */}
            <div className="glass-panel" style={{ padding: '2rem', opacity: 0.7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', margin: '0 0 10px 0' }}>FIP-11: Ridurre le gas fee interne al 0.01%</h4>
                  <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.9rem' }}>Votazione completata con successo. Implementazione in corso nello Smart Contract.</p>
                </div>
                <span style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>Passed</span>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
