"use client";
import React from 'react';
import Navbar from "@/components/Navbar";

export default function DropsPage() {
  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '1rem', paddingBottom: '120px' }}>
      <Navbar />
      <main style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3.5rem', margin: '0 0 1rem 0' }}>Proof of <span className="text-gradient">Dance</span></h1>
          <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Airdrop esclusivi attivati dalla tua posizione geografica. Nessun Drop attivo al momento nella tua zona.
          </p>
        </div>
      </main>
    </div>
  );
}
