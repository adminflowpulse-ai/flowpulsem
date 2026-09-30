"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../components/LanguageProvider';

export default function Home() {
  const [email, setEmail] = useState('');
  const [gdpr, setGdpr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !gdpr) return;

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
          setErrorMsg(t("Questa email è già in lista d'attesa!"));
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px', zIndex: 10, maxWidth: '800px' }}>
        <img src="/logo.png" alt="FlowPulseM Logo" style={{ width: "250px", height: "250px", objectFit: "contain", margin: "0 auto", display: "block" }} />
        
        <h1 style={{ color: 'var(--text-main)', fontSize: '2rem', marginTop: '20px', letterSpacing: '1px', fontWeight: 'bold' }}>
          {t("La Nuova Era dell'Industria Musicale")}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '15px', lineHeight: '1.6' }}>
          {t("La prima piattaforma Web3 che connette i DJ ai loro super-fan attraverso NFT musicali, royalty condivise e live room.")}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', marginTop: '30px', textAlign: 'left' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', flex: '1', minWidth: '250px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ color: 'var(--accent-blue)', marginBottom: '10px' }}>🎧 Per i DJ</h3>
            <ul style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', paddingLeft: '20px' }}>
              <li>{t("Zero commissioni intermedie sulle tue tracce")}</li>
              <li>{t("Vendi drop musicali come NFT esclusivi")}</li>
              <li>{t("Crea Live Room e interagisci con i veri fan")}</li>
            </ul>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', flex: '1', minWidth: '250px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ color: 'var(--accent-green)', marginBottom: '10px' }}>🎵 Per i Fan</h3>
            <ul style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', paddingLeft: '20px' }}>
              <li>{t("Guadagna royalty supportando i tuoi artisti")}</li>
              <li>{t("Colleziona rarità musicali verificabili")}</li>
              <li>{t("Vota e partecipa alla governance DAO")}</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--surface-color)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', maxWidth: '500px', width: '100%', textAlign: 'center', zIndex: 10, backdropFilter: 'blur(10px)' }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-blue)', marginBottom: '10px' }}>{t("Accesso Anticipato su Invito")}</h2>
        
        {isSuccess ? (
          <div style={{ padding: '30px 0' }}>
            <h3 style={{ color: 'var(--accent-green)', fontSize: '1.5rem', marginBottom: '15px' }}>{t("Benvenuto a Bordo!")}</h3>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.6' }}>
              {t("La tua email")} <strong style={{ color: '#fff' }}>{email}</strong> {t("è stata aggiunta alla lista prioritaria.")}
            </p>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.6', marginTop: '15px' }}>
              {t("Ti contatteremo non appena i server saranno aperti al pubblico con i tuoi vantaggi esclusivi Early Bird.")}
            </p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.5', marginBottom: '2rem' }}>
              {t("Iscriviti ora alla lista d'attesa per garantirti l'accesso prioritario e ottenere reward speciali al lancio.")}
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
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', textAlign: 'left', marginTop: '5px' }}>
                <input 
                  type="checkbox" 
                  id="gdpr" 
                  checked={gdpr}
                  onChange={(e) => setGdpr(e.target.checked)}
                  required
                  style={{ marginTop: '4px', cursor: 'pointer' }}
                />
                <label htmlFor="gdpr" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.4', cursor: 'pointer' }}>
                  {t("Acconsento al trattamento dei miei dati personali per ricevere comunicazioni sull'accesso alla piattaforma, in conformità con la Privacy Policy.")}
                </label>
              </div>

              <button type="submit" disabled={isLoading || !gdpr} style={{ padding: '20px', borderRadius: '12px', border: 'none', background: 'var(--accent-gradient)', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', cursor: (isLoading || !gdpr) ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s, box-shadow 0.2s', opacity: (isLoading || !gdpr) ? 0.5 : 1, boxShadow: '0 0 15px rgba(27, 97, 255, 0.4)', marginTop: '10px' }}>
                {isLoading ? t("Iscrizione in corso...") : t("Iscriviti alla Lista d'Attesa")}
              </button>
              {errorMsg && <p style={{ color: 'var(--accent-red)', fontSize: '0.9rem', margin: 0 }}>{errorMsg}</p>}
            </form>
          </>
        )}

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>{t("Esplora la Demo Pubblica")}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '15px' }}>{t("(Nessun wallet richiesto per navigare)")}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/dashboard/dj" style={{ textDecoration: 'none' }}>
              <button style={{ width: '100%', padding: '15px', borderRadius: '12px', backgroundColor: 'transparent', border: '1px solid var(--accent-blue)', color: '#fff', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>
                🎧 {t("ESPLORA COME DJ")}
              </button>
            </Link>
            <Link href="/dashboard/fan" style={{ textDecoration: 'none' }}>
              <button style={{ width: '100%', padding: '15px', borderRadius: '12px', backgroundColor: 'transparent', border: '1px solid var(--accent-green)', color: '#fff', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>
                🎵 {t("ESPLORA COME FAN")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
