"use client";
import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLanguage } from '@/components/LanguageProvider';

export default function PreLaunchWall() {
  const { t } = useLanguage();
  const [email, setEmail] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setErrorMsg('');
    
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email: email }]);
      
    if (error) {
      if (error.code === '23505') {
         setErrorMsg('Questa email ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨ giÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  in lista d\'attesa!');
      } else {
         setErrorMsg(t('Errore di connessione. Riprova.'));
         console.error(error);
      }
    } else {
      setIsSubmitted(true);
    }
    setIsLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-color)', color: '#fff', fontFamily: 'var(--font-heading)', textAlign: 'center', padding: '2rem' }}>
      
      {/* Animated Logo */}
      <div style={{ marginBottom: '2rem', animation: 'fadeInDown 1s ease-out' }}>
        <h1 style={{ fontFamily: "'Dancing Script', cursive", margin: 0, fontSize: 'clamp(3.5rem, 12vw, 5.5rem)', cursor: 'pointer', display: 'flex', alignItems: 'baseline', justifyContent: 'center', fontWeight: 700, letterSpacing: '3px' }}>
            <span style={{ background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-green))', WebkitBackgroundClip: 'text', color: 'transparent', paddingRight: '5px' }}>FlowPulse</span>
            <span style={{ color: 'var(--accent-red)', textShadow: '0 0 20px rgba(255,0,60,0.7)' }}>M</span>
            <sup style={{ color: 'var(--accent-red)', fontSize: 'clamp(1rem, 4vw, 2rem)', marginLeft: '4px', textShadow: 'none' }}>&reg;</sup>
        </h1>
        <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginTop: '10px', letterSpacing: '2px', textTransform: 'uppercase' }}>
          {t('La Nuova Era dell\'Industria Musicale')}
        </p>
      </div>

      {/* Main Box */}
      <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid rgba(27, 97, 255, 0.4)', borderRadius: '15px', padding: '4rem 5rem', maxWidth: '1000px', width: '95%', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', animation: 'fadeInUp 1s ease-out 0.3s backwards' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--text-highlight)' }}>{t('Accesso Anticipato Chiuso')}</h2>
        
        {isSubmitted ? (
          <div style={{ padding: '2rem', backgroundColor: 'rgba(0, 255, 51, 0.1)', border: '1px solid var(--accent-green)', borderRadius: '10px', marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--accent-green)', marginTop: 0 }}>{t('Benvenuto a Bordo!')}</h3>
            <p style={{ color: '#ddd', marginBottom: 0 }}>{t('La tua email')} ({email}) {t('è stata aggiunta alla lista prioritaria.')} {t('Ti contatteremo non appena i server saranno aperti al pubblico.')}</p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.5', marginBottom: '2rem' }}>
              {t('La piattaforma è attualmente in fase di Closed Beta.')}
              {t('Lascia la tua email per entrare in lista d\'attesa.')}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '2rem' }}>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('La tua email (es. dj@gmail.com)')} 
                required
                disabled={isLoading}
                style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '1rem', outline: 'none' }}
              />
              <button type="submit" disabled={isLoading} style={{ padding: '20px', borderRadius: '12px', border: 'none', background: 'var(--accent-gradient)', color: '#fff', fontSize: '1.4rem', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s, box-shadow 0.2s', opacity: isLoading ? 0.7 : 1, boxShadow: '0 0 15px rgba(27, 97, 255, 0.4)' }}>
                {isLoading ? t('Iscrizione in corso...') : t('Mettimi in Lista d\'Attesa')}
              </button>
              {errorMsg && <p style={{ color: 'var(--accent-red)', fontSize: '0.9rem', margin: 0 }}>{errorMsg}</p>}
            </form>
          </>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', borderTop: '1px solid #333', paddingTop: '2rem' }}>
          <h3 style={{ color: 'var(--text-main)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>{t('Accesso Web3')}</h3>
          
          <Link href="/dashboard/dj" style={{ padding: '20px 30px', borderRadius: '15px', backgroundColor: 'transparent', border: '2px solid var(--accent-blue)', color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.4rem', transition: 'all 0.3s', textAlign: 'center' }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-blue)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(27, 97, 255, 0.5)'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}>
            🎧 SONO UN DJ (Connetti Wallet)
          </Link>
          
          <Link href="/dashboard/fan" style={{ padding: '20px 30px', borderRadius: '15px', backgroundColor: 'transparent', border: '2px solid var(--accent-green)', color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.4rem', transition: 'all 0.3s', textAlign: 'center' }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-green)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 51, 0.5)'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}>
            🎵 SONO UN FAN (Connetti Wallet)
          </Link>
          
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
            <ConnectButton />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: "\n        @keyframes fadeInDown {\n          from { opacity: 0; transform: translateY(-30px); }\n          to { opacity: 1; transform: translateY(0); }\n        }\n        @keyframes fadeInUp {\n          from { opacity: 0; transform: translateY(30px); }\n          to { opacity: 1; transform: translateY(0); }\n        }\n      "}} />
    </div>
  );
}

