"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminControlRoom() {
  const [revenue, setRevenue] = useState(145230);
  const [activeDjs, setActiveDjs] = useState(42);
  const [vinylsMinted, setVinylsMinted] = useState(892);

  useEffect(() => {
    const interval = setInterval(() => {
      setRevenue(prev => prev + Math.floor(Math.random() * 50));
      if (Math.random() > 0.8) setVinylsMinted(prev => prev + 1);
      if (Math.random() > 0.95) setActiveDjs(prev => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'sans-serif', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#ff4a4a', margin: 0, fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff4a4a', boxShadow: '0 0 10px #ff4a4a', animation: 'pulse 2s infinite' }} />
            God Mode: Admin Control Room (SIMULATION)
          </h1>
          <p style={{ color: '#888', margin: '5px 0 0 0' }}>Benvenuto, Fondatore. Hai il controllo totale sull'ecosistema FlowPulse.</p>
        </div>
        <Link href="/" style={{ padding: '10px 20px', backgroundColor: '#333', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>Torna al Sito Pubblico</Link>
      </header>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '2rem' }}>
        <StatCard title="Entrate Totali (FIAT/Crypto)" value={`$${revenue.toLocaleString()}`} color="#4aff4a" />
        <StatCard title="DJ Attivi Ora" value={activeDjs} color="#4aff4a" />
        <StatCard title="Vinili NFT Coniati" value={vinylsMinted} color="#a64aff" />
        <StatCard title="Server Oracle (GPU)" value="Elaborazione..." color="#ffaa4a" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Main Panel */}
        <div style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '10px', padding: '20px' }}>
          <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: 0 }}>Gestione Server & API</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            <ServerStatus name="Vercel (Frontend Hosting)" status="Connesso" color="#4aff4a" />
            <ServerStatus name="Supabase (Database Utenti)" status="Connesso" color="#4aff4a" />
            <ServerStatus name="Amazon AWS S3 (Storage Audio)" status="In Attesa di Chiavi" color="#ffaa4a" />
            <ServerStatus name="Replicate (AI Oracle Python)" status="In Attesa di Chiavi" color="#ffaa4a" />
            <ServerStatus name="Alchemy (Nodo Polygon Web3)" status="In Attesa di Chiavi" color="#ffaa4a" />
          </div>
        </div>

        {/* Action Panel */}
        <div style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '10px', padding: '20px' }}>
          <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: 0 }}>Azioni Rapide</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
            <ActionButton text="Airdrop `$FPM` agli Utenti" color="#333" disabled />
            <ActionButton text="Ferma Minting Vinili" color="#4a1111" disabled />
            <ActionButton text="Modifica Tasse Marketplace" color="#333" disabled />
            <ActionButton text="Scarica Report Finanziario" color="#114a11" disabled />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string, value: string | number, color: string }) {
  return (
    <div style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '10px', padding: '20px', borderLeft: `4px solid ${color}` }}>
      <h3 style={{ color: '#888', fontSize: '0.9rem', margin: '0 0 10px 0' }}>{title}</h3>
      <p style={{ color: '#fff', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{value}</p>
    </div>
  );
}

function ServerStatus({ name, status, color }: { name: string, status: string, color: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '5px' }}>
      <span style={{ color: '#ddd' }}>{name}</span>
      <span style={{ color: color, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
        {status}
      </span>
    </div>
  );
}

function ActionButton({ text, color, disabled }: { text: string, color: string, disabled?: boolean }) {
  return (
    <button disabled={disabled} style={{ padding: '15px', backgroundColor: color, color: '#fff', border: 'none', borderRadius: '5px', cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: disabled ? 0.5 : 1 }}>
      {text}
    </button>
  );
}
