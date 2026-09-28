"use client";
import React from 'react';
import Navbar from "@/components/Navbar";

export default function StudioPage() {
  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        
        {/* Sfondo Animato */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, rgba(0, 240, 255, 0.1) 0%, transparent 70%)', zIndex: -1 }}></div>

        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', maxWidth: '800px', width: '90%', border: '1px solid rgba(0, 240, 255, 0.3)', boxShadow: '0 0 50px rgba(0, 240, 255, 0.1)', position: 'relative', overflow: 'hidden' }}>
          
          {/* Badge "In Sviluppo" */}
          <div style={{ position: 'absolute', top: '20px', right: '-35px', background: '#ff3366', color: '#fff', padding: '5px 40px', transform: 'rotate(45deg)', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '2px', boxShadow: '0 0 15px rgba(255, 51, 102, 0.5)' }}>
            AWS + AI
          </div>

          <h1 style={{ fontSize: '4rem', margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '4px' }}>
            Web3 <span className="text-gradient">DAW</span>
          </h1>
          
          <h2 style={{ color: '#00f0ff', fontSize: '1.5rem', marginBottom: '2rem', fontWeight: 'normal', letterSpacing: '2px' }}>
            LA RIVOLUZIONE DELLO STUDIO MUSICALE
          </h2>

          <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            Stiamo addestrando l'Oracolo IA sui server <b>Amazon AWS</b>. 
            A breve, i DJ potranno caricare i propri brani direttamente nella Cloud DAW di FlowPulseM per l'isolamento automatico delle tracce (Vocals, Bass, Synth, Drums) e il conio istantaneo di NFT Multitraccia.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px 25px', borderRadius: '12px', border: '1px solid #333' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>☁️</span>
              <span style={{ color: '#aaa', fontWeight: 'bold' }}>AWS Storage</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px 25px', borderRadius: '12px', border: '1px solid #333' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>🤖</span>
              <span style={{ color: '#aaa', fontWeight: 'bold' }}>AI Stem Split</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px 25px', borderRadius: '12px', border: '1px solid #333' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>💿</span>
              <span style={{ color: '#aaa', fontWeight: 'bold' }}>NFT Minting</span>
            </div>
          </div>

          <div style={{ marginTop: '4rem' }}>
            <span style={{ display: 'inline-block', border: '2px solid #00f0ff', color: '#00f0ff', padding: '15px 40px', borderRadius: '30px', fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', animation: 'pulse 2s infinite' }}>
              COMING SOON
            </span>
          </div>

        </div>
      </main>
    </div>
  );
}
