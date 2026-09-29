"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../components/LanguageProvider';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email) return;

    setIsLoading(true);

    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
      } else {
        if (data.error === 'Email already exists') {
          setErrorMsg(t("Questa email Ã¨ giÃ  in lista d'attesa!"));
        } else {
          setErrorMsg(t("Errore di connessione. Riprova."));
        }
      }
    } catch (err) {
      setErrorMsg(t("Errore di connessione. Riprova."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px', zIndex: 10 }}>
        <h1 style={{ fontFamily: "'Dancing Script', cursive", margin: 0, fontSize: 'clamp(4rem, 10vw, 8rem)', fontWeight: 700, letterSpacing: '3px', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <span style={{ background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-green))', WebkitBackgroundClip: 'text', color: 'transparent', paddingRight: '5px' }}>FlowPulse</span>
            <span style={{ color: 'var(--accent-red)', textShadow: '0 0 20px rgba(255,0,60,0.7)' }}>M</span>
            <sup style={{ color: 'var(--accent-red)', fontSize: 'clamp(1rem, 4vw, 2rem)', marginLeft: '4px', textShadow: 'none' }}>Â®</sup>
        </h1>
        <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginTop: '10px', letterSpacing: '2px', textTransform: 'uppercase' }}>
          {t("La Nuova Era dell'Industria Musicale")}
        </p>
      </div>

      <div style={{ background: 'var(--surface-color)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', maxWidth: '500px', width: '100%', textAlign: 'center', zIndex: 10, backdropFilter: 'blur(10px)' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--accent-blue)', marginBottom: '10px' }}>{t("Accesso Anticipato Chiuso")}</h2>
        
        {isSuccess ? (
          <div style={{ padding: '30px 0' }}>
            <h3 style={{ color: 'var(--accent-green)', fontSize: '1.5rem', marginBottom: '15px' }}>{t("Benvenuto a Bordo!")}</h3>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.6' }}>
              {t("La tua email")} <strong style={{ color: '#fff' }}>{email}</strong> {t("Ã¨ stata aggiunta alla lista prioritaria.")}
            </p>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.6', marginTop: '15px' }}>
              {t("Ti contatteremo non appena i server saranno aperti al pubblico.")}
            </p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.5', marginBottom: '2rem' }}>
              {t("La piattaforma Ã¨ attualmente in fase di Closed Beta.")}<br/>
              {t("Lascia la tua email per entrare in lista d'attesa.")}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '2rem' }}>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("La tua email (es. dj@gmail.com)")} 
                required
                style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '1rem', outline: 'none' }}
              />
              <button type="submit" disabled={isLoading} style={{ padding: '20px', borderRadius: '12px', border: 'none', background: 'var(--accent-gradient)', color: '#fff', fontSize: '1.4rem', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s, box-shadow 0.2s', opacity: isLoading ? 0.7 : 1, boxShadow: '0 0 15px rgba(27, 97, 255, 0.4)' }}>
                {isLoading ? t("Iscrizione in corso...") : t("Mettimi in Lista d'Attesa")}
              </button>
              {errorMsg && <p style={{ color: 'var(--accent-red)', fontSize: '0.9rem', margin: 0 }}>{errorMsg}</p>}
            </form>
          </>
        )}

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>{t("Accesso Web3")}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/dashboard/dj" style={{ textDecoration: 'none' }}>
              <button style={{ width: '100%', padding: '15px', borderRadius: '12px', backgroundColor: 'transparent', border: '1px solid var(--accent-blue)', color: '#fff', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>
                ðŸŽ§ {t("SONO UN DJ (Connetti Wallet)")}
              </button>
            </Link>
            <Link href="/dashboard/fan" style={{ textDecoration: 'none' }}>
              <button style={{ width: '100%', padding: '15px', borderRadius: '12px', backgroundColor: 'transparent', border: '1px solid var(--accent-green)', color: '#fff', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>
                ðŸŽµ {t("SONO UN FAN (Connetti Wallet)")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
