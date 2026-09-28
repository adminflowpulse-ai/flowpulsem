"use client";
import React from 'react';
import Navbar from "@/components/Navbar";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', maxWidth: '800px', width: '100%' }}>
          <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Scegli il tuo percorso</h1>
          <p style={{ color: 'var(--text-main)', marginBottom: '3rem', fontSize: '1.2rem', lineHeight: '1.6' }}>
            Registrati all'ecosistema Web3 tramite il tuo Wallet, oppure esplora le Dashboard simulando un ruolo.
          </p>
          
          {/* Demo Buttons */}
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
            <Link href="/dashboard/dj" style={{ textDecoration: 'none' }}>
              <div className="hover-scale" style={{ border: '2px solid var(--accent-primary)', padding: '2rem', borderRadius: '15px', background: 'rgba(0, 240, 255, 0.1)', minWidth: '250px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎧</div>
                <h3 style={{ color: 'var(--accent-primary)', fontSize: '1.5rem', margin: '0 0 10px 0' }}>Sono un DJ</h3>
                <p style={{ color: '#aaa', margin: 0 }}>Crea il tuo Studio e monetizza la tua musica</p>
              </div>
            </Link>

            <Link href="/dashboard/fan" style={{ textDecoration: 'none' }}>
              <div className="hover-scale" style={{ border: '2px solid var(--accent-secondary)', padding: '2rem', borderRadius: '15px', background: 'rgba(166, 74, 255, 0.1)', minWidth: '250px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔥</div>
                <h3 style={{ color: 'var(--accent-secondary)', fontSize: '1.5rem', margin: '0 0 10px 0' }}>Sono un Fan</h3>
                <p style={{ color: '#aaa', margin: 0 }}>Supporta i talenti e fai compravendita</p>
              </div>
            </Link>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
            <span style={{ color: '#666' }}>Oppure registrati col vero Wallet:</span>
            <div style={{ transform: 'scale(1.1)' }}>
              <ConnectButton />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
