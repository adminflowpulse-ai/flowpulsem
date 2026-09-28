"use client";
import React from 'react';

export default function PitchGeneral() {
  return (
    <div style={{ backgroundColor: '#0d0f1a', minHeight: '100vh', padding: '40px', color: '#fff', fontFamily: 'var(--font-body)' }}>
      
      {/* Slide 1 - Titolo */}
      <div style={{ 
        height: '80vh', 
        marginBottom: '100px',
        padding: '50px', 
        border: '4px solid transparent',
        background: 'linear-gradient(#0d0f1a, #0d0f1a) padding-box, linear-gradient(135deg, var(--accent-blue), var(--accent-green), var(--accent-red)) border-box',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <h1 style={{ fontFamily: "'Dancing Script', cursive", margin: '0 0 30px 0', fontSize: '7rem', fontWeight: 700, letterSpacing: '3px', display: 'flex', alignItems: 'baseline' }}>
            <span style={{ background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-green))', WebkitBackgroundClip: 'text', color: 'transparent', paddingRight: '5px' }}>FlowPulse</span>
            <span style={{ color: 'var(--accent-red)', textShadow: '0 0 20px rgba(255,0,60,0.7)' }}>M</span>
            <sup style={{ color: 'var(--accent-red)', fontSize: '2.5rem', marginLeft: '8px', textShadow: 'none' }}>&reg;</sup>
        </h1>
        <h2 style={{ fontSize: '3rem', color: 'var(--text-highlight)', letterSpacing: '2px', margin: 0, textTransform: 'uppercase' }}>Presentazione Generale</h2>
        <h3 style={{ fontSize: '1.8rem', color: '#888', marginTop: '20px' }}>Ecosistema Crypto & Web3</h3>
      </div>

      {/* Slide 2 - Problema / Soluzione */}
      <div style={{ 
        height: '80vh', 
        marginBottom: '100px',
        padding: '60px', 
        border: '4px solid transparent',
        background: 'linear-gradient(#0d0f1a, #0d0f1a) padding-box, linear-gradient(135deg, var(--accent-blue), var(--accent-green), var(--accent-red)) border-box',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h2 style={{ fontSize: '3.5rem', color: 'var(--accent-red)', margin: '0 0 30px 0', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>Il Problema del Web2</h2>
        <p style={{ fontSize: '2rem', lineHeight: '1.6', color: '#d0d0d0', marginBottom: '50px' }}>
          Oggi gli artisti sono ostaggio delle piattaforme (Spotify, Apple Music). 
          Trattengono l'80% dei profitti. Gli intermediari divorano la creatività.
        </p>

        <h2 style={{ fontSize: '3.5rem', color: 'var(--accent-green)', margin: '0 0 30px 0', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>La Soluzione Web3</h2>
        <p style={{ fontSize: '2rem', lineHeight: '1.6', color: '#d0d0d0' }}>
          Restituiamo il potere. Nessun intermediario. Proprietà diretta dei Fan Token. 
          <span style={{ color: 'var(--accent-green)', fontWeight: 'bold', display: 'block', marginTop: '20px' }}>0% di commissioni per chi crea.</span>
        </p>
      </div>

      {/* Slide 3 - Tokenomics */}
      <div style={{ 
        height: '80vh', 
        padding: '60px', 
        border: '4px solid transparent',
        background: 'linear-gradient(#0d0f1a, #0d0f1a) padding-box, linear-gradient(135deg, var(--accent-blue), var(--accent-green), var(--accent-red)) border-box',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h2 style={{ fontSize: '3.5rem', color: 'var(--accent-blue)', margin: '0 0 40px 0', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>Struttura del Mercato ()</h2>
        
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '2.5rem', color: '#fff', margin: '0 0 10px 0' }}>Creatori (Supply)</h3>
          <p style={{ fontSize: '1.8rem', color: 'var(--accent-green)' }}>Trattengono il 100%. Nessuna tassa occulta.</p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '2.5rem', color: '#fff', margin: '0 0 10px 0' }}>Investitori (Demand)</h3>
          <p style={{ fontSize: '1.8rem', color: '#888' }}>Pagano lo spread di mercato al momento dell'acquisto, sostenendo l'ecosistema.</p>
        </div>

        <div>
          <h3 style={{ fontSize: '2.5rem', color: '#fff', margin: '0 0 10px 0' }}>Scout (Viralità)</h3>
          <p style={{ fontSize: '1.8rem', color: 'var(--accent-red)' }}>Contratti a vita del 5% sui volumi dei talenti portati sulla piattaforma.</p>
        </div>
      </div>

    </div>
  );
}