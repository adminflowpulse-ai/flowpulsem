'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLanguage, Language } from './LanguageProvider';

const languageFlags: Record<Language, { flag: string, name: string }> = {
  it: { flag: '\uD83C\uDDEE\uD83C\uDDF9', name: 'IT' },
  en: { flag: '\uD83C\uDDEC\uD83C\uDDE7', name: 'EN' },
  es: { flag: '\uD83C\uDDEA\uD83C\uDDF8', name: 'ES' },
  fr: { flag: '\uD83C\uDDEB\uD83C\uDDF7', name: 'FR' },
  de: { flag: '\uD83C\uDDE9\uD83C\uDDEA', name: 'DE' },
  ru: { flag: '\uD83C\uDDF7\uD83C\uDDFA', name: 'RU' },
  ja: { flag: '\uD83C\uDDEF\uD83C\uDDF5', name: 'JA' },
  zh: { flag: '\uD83C\uDDE8\uD83C\uDDF3', name: 'ZH' },
  ko: { flag: '\uD83C\uDDF0\uD83C\uDDF7', name: 'KO' },
  hi: { flag: '\uD83C\uDDEE\uD83C\uDDF3', name: 'HI' }
};

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav style={{ padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--surface-color)', borderBottom: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', gap: '15px' }}>
      
      {/* Logo from Image */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/logo.png" alt="FlowPulseM Logo" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
        <h1 style={{ fontFamily: "'Dancing Script', cursive", margin: 0, fontSize: '2rem', fontWeight: 700, display: 'none' }}>
          FlowPulseM
        </h1>
      </Link>

      {/* Links Center - Restored All The Features */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
        <Link href="/feed" style={{ color: 'var(--accent-green)', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold' }}>{t('Flow Feed')}</Link>
        <Link href="/artists" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold' }}>{t('Artisti')}</Link>
        <Link href="/marketplace" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold' }}>{t('Marketplace')}</Link>
        <Link href="/compravendita" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold' }}>{t('Compravendita')}</Link>
        <Link href="/mixer" style={{ color: 'var(--accent-red)', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold' }}>{t('Web3 Mixer')}</Link>
        <Link href="/drops" style={{ color: 'var(--accent-green)', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold' }}>{t('Geo-Drops')}</Link>
        <Link href="/governance" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold' }}>{t('DAO')}</Link>
        <Link href="/studio" style={{ color: 'var(--accent-red)', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold' }}>{t('Studio')}</Link>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        
        {/* Language Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}
          >
            {languageFlags[language].flag} {languageFlags[language].name}
            <span style={{ fontSize: '0.8rem' }}>▼</span>
          </button>
          
          {showDropdown && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '5px', background: '#1a1b23', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden', zIndex: 1000, minWidth: '120px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              {Object.entries(languageFlags).map(([code, {flag, name}]) => (
                <button
                  key={code}
                  onClick={() => { setLanguage(code as Language); setShowDropdown(false); }}
                  style={{ display: 'block', width: '100%', padding: '10px 15px', background: language === code ? 'rgba(0, 240, 255, 0.1)' : 'transparent', border: 'none', color: '#fff', textAlign: 'left', cursor: 'pointer', transition: 'background 0.2s', fontSize: '1rem' }}
                >
                  {flag} {name}
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
