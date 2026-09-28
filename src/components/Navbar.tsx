'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLanguage, Language } from './LanguageProvider';

const languageFlags: Record<Language, { flag: string, name: string }> = {
  it: { flag: '🇮🇹', name: 'IT' },
  en: { flag: '🇬🇧', name: 'EN' },
  es: { flag: '🇪🇸', name: 'ES' },
  fr: { flag: '🇫🇷', name: 'FR' },
  de: { flag: '🇩🇪', name: 'DE' },
  ru: { flag: '🇷🇺', name: 'RU' },
  ja: { flag: '🇯🇵', name: 'JA' },
  zh: { flag: '🇨🇳', name: 'ZH' },
  ko: { flag: '🇰🇷', name: 'KO' },
  hi: { flag: '🇮🇳', name: 'HI' }
};

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--surface-color)', borderBottom: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', gap: '20px' }}>
      
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <h1 style={{ fontFamily: "'Dancing Script', cursive", margin: 0, fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 700, letterSpacing: '2px' }}>
          <span style={{ background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-green))', WebkitBackgroundClip: 'text', color: 'transparent', paddingRight: '2px' }}>FlowPulse</span>
          <span style={{ color: 'var(--accent-red)', textShadow: '0 0 10px rgba(255,0,60,0.5)' }}>M</span>
        </h1>
      </Link>

      {/* Links Center */}
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <Link href="/feed" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 600, transition: 'color 0.2s' }}>{t('Feed')}</Link>
        <Link href="/artists" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 600, transition: 'color 0.2s' }}>{t('Artisti')}</Link>
        <Link href="/explore" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 600, transition: 'color 0.2s' }}>{t('Esplora')}</Link>
        <Link href="/marketplace" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 600, transition: 'color 0.2s' }}>{t('Mercato')}</Link>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        
        {/* Language Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '8px 12px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', minWidth: '70px', justifyContent: 'center' }}
          >
            <span style={{ fontSize: '1.2rem' }}>{languageFlags[language].flag}</span>
            <span>{languageFlags[language].name}</span>
          </button>
          
          {showDropdown && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '10px', background: 'var(--surface-color)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', zIndex: 100, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              {(Object.keys(languageFlags) as Language[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setShowDropdown(false); }}
                  style={{ background: language === lang ? 'rgba(27, 97, 255, 0.2)' : 'transparent', border: 'none', borderRadius: '8px', padding: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', width: '100%', textAlign: 'left', transition: 'background 0.2s' }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{languageFlags[lang].flag}</span>
                  <span style={{ fontWeight: language === lang ? 'bold' : 'normal' }}>{languageFlags[lang].name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <ConnectButton />
      </div>

    </nav>
  );
}