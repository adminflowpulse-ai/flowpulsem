"use client";
import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageProvider";

export default function StudioPage() {
  const { t } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [minedFpm, setMinedFpm] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUploading && progress < 100) {
      interval = setInterval(() => {
        setProgress(p => {
          const newProgress = p + (Math.random() * 5 + 2);
          return newProgress >= 100 ? 100 : newProgress;
        });
        
        // Mine fractions of FPM dynamically based on upload progress
        setMinedFpm(prev => prev + (Math.random() * 0.03 + 0.01));
      }, 300);
    } else if (progress >= 100) {
      setIsUploading(false);
      setHasCompleted(true);
    }
    return () => clearInterval(interval);
  }, [isUploading, progress]);

  const handleUploadClick = () => {
    if (isUploading) return;
    setIsUploading(true);
    setProgress(0);
    setMinedFpm(0);
    setHasCompleted(false);
  };

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '2rem 1rem' }}>
        
        {/* Sfondo Animato */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, rgba(0, 240, 255, 0.05) 0%, transparent 70%)', zIndex: -1 }}></div>

        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '800px', width: '100%', border: '1px solid rgba(0, 240, 255, 0.3)', boxShadow: '0 0 50px rgba(0, 240, 255, 0.1)', position: 'relative', overflow: 'hidden', borderRadius: '24px' }}>
          
          <div style={{ position: 'absolute', top: '20px', right: '-35px', background: 'var(--accent-green)', color: '#000', padding: '5px 40px', transform: 'rotate(45deg)', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '2px', boxShadow: '0 0 15px rgba(0, 255, 136, 0.5)' }}>
            NEW FEATURE
          </div>

          <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '2px' }}>
            <span style={{ color: 'var(--accent-green)' }}>Upload</span>-to-<span style={{ color: '#FFD700' }}>Earn</span>
          </h1>
          
          <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '2rem', margin: '0 auto 2rem auto' }}>
            {t("Guadagna frazioni di $FPM Coin per ogni traccia che carichi! Come le app in cui 'cammini e mini', su FlowPulseM vieni ricompensato tramite Proof-of-Contribution per arricchire l'ecosistema.")}
          </p>

          {/* SIMULATORE DI MINING */}
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
            
            <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#FFD700', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textShadow: isUploading ? '0 0 20px rgba(255, 215, 0, 0.6)' : 'none', transition: 'text-shadow 0.3s' }}>
              + {minedFpm.toFixed(4)} 
              <img src="/coin.jpg" alt="FPM Coin" style={{ height: "1em", borderRadius: "50%" }} />
            </div>

            {isUploading && (
              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden', marginBottom: '1rem' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-green))', transition: 'width 0.3s linear' }}></div>
              </div>
            )}

            <p style={{ color: 'var(--accent-blue)', fontWeight: 'bold', height: '20px', margin: '0 0 1.5rem 0' }}>
              {isUploading ? t("Caricamento & Mining in corso...") : hasCompleted ? t("Traccia caricata con successo! Hai minato $FPM.") : ""}
            </p>

            <button 
              onClick={handleUploadClick}
              disabled={isUploading}
              style={{ 
                padding: '15px 40px', 
                background: isUploading ? 'rgba(255,255,255,0.1)' : 'var(--accent-gradient)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '30px', 
                fontSize: '1.2rem', 
                fontWeight: 'bold', 
                cursor: isUploading ? 'not-allowed' : 'pointer',
                boxShadow: isUploading ? 'none' : '0 10px 20px rgba(27, 97, 255, 0.4)',
                transition: 'all 0.3s'
              }}
            >
              🎧 {isUploading ? t("Mining...") : t("Carica Traccia & Inizia a Minare")}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginTop: '2rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px 25px', borderRadius: '12px', border: '1px solid #333' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>🎵</span>
              <span style={{ color: '#aaa', fontWeight: 'bold', fontSize: '0.9rem' }}>Upload Track</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px 25px', borderRadius: '12px', border: '1px solid #333' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>⚡</span>
              <span style={{ color: '#aaa', fontWeight: 'bold', fontSize: '0.9rem' }}>AI Processing</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px 25px', borderRadius: '12px', border: '1px solid #333' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>⛏️</span>
              <span style={{ color: '#aaa', fontWeight: 'bold', fontSize: '0.9rem' }}>Mine $FPM</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
