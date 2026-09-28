"use client";
import React from 'react';

export default function PitchSquillace() {
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
        <h2 style={{ fontSize: '3rem', color: 'var(--text-highlight)', letterSpacing: '2px', margin: 0, textTransform: 'uppercase' }}>Pitch Ambassador</h2>
        <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-green)', marginTop: '20px' }}>Davide Squillace</h3>
      </div>

      {/* Slide 2 - Oval Office */}
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
        <h2 style={{ fontSize: '3.5rem', color: 'var(--accent-blue)', margin: '0 0 40px 0', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>1. La Visione (L'Oval Office)</h2>
        <p style={{ fontSize: '2rem', lineHeight: '1.6', color: '#d0d0d0', marginBottom: '30px' }}>
          Davide, stiamo costruendo un impero tecnologico e musicale. Quello che ti stiamo proponendo non Ã¨ essere un semplice utente, ma sederti nell'<span style={{ color: 'var(--accent-red)', fontWeight: 'bold' }}>Oval Office</span> prima che il resto del mondo sappia che esiste.
        </p>
        <p style={{ fontSize: '2rem', lineHeight: '1.6', color: '#d0d0d0' }}>
          Oggi ti garantiamo 100.000 $FPM al prezzo Ground Zero (0.01 Euro). Noi azzeriamo completamente le commissioni per i creatori: <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>0% Fee per te.</span> I costi dell'infrastruttura li paga interamente il mercato.
        </p>
      </div>

      {/* Slide 3 - Vantaggio */}
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
        <h2 style={{ fontSize: '3.5rem', color: 'var(--accent-green)', margin: '0 0 40px 0', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>2. Il Vantaggio "Second Zero"</h2>
        <p style={{ fontSize: '2.2rem', lineHeight: '1.6', color: '#fff', fontWeight: 'bold', marginBottom: '30px' }}>
          Entrando ora come Ambassador, il tuo portafoglio agisce come un moltiplicatore spaventoso. 
        </p>
        <p style={{ fontSize: '2rem', lineHeight: '1.6', color: '#d0d0d0' }}>
          Quando il mercato globale (utenti, fan, investitori) entrerÃ  a mercato aperto e spingerÃ  il token a 2.00 Euro, tu avrai fatto un <span style={{ color: 'var(--accent-green)', fontWeight: 'bold', fontSize: '3rem', display: 'block', margin: '30px 0' }}>2000x Netto</span> 
          esattamente come i primi soci delle grandi Tech Americane. Sei dei nostri?
        </p>
      </div>

    </div>
  );
}