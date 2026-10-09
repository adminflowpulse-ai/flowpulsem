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

const navLinks = [
  { href: '/feed',          labelKey: 'Flow Feed',     color: 'var(--accent-green)' },
  { href: '/artists',       labelKey: 'Artisti',       color: 'var(--text-main)'   },
  { href: '/marketplace',   labelKey: 'Marketplace',   color: 'var(--text-main)'   },
  { href: '/compravendita', labelKey: 'Compravendita', color: 'var(--accent-blue)' },
  { href: '/mixer',         labelKey: 'Web3 Mixer',    color: 'var(--accent-red)'  },
  { href: '/drops',         labelKey: 'Geo-Drops',     color: 'var(--accent-green)'},
  { href: '/governance',    labelKey: 'DAO',           color: 'var(--accent-blue)' },
  { href: '/studio',        labelKey: 'Studio',        color: 'var(--accent-red)'  },
];

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav style={{
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--surface-color)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 999,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="FlowPulseM Logo" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
        </Link>

        {/* Links desktop — nascosti su mobile */}
        <div style={{
          display: 'flex',
          gap: '18px',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
          flex: 1,
        }} className="desktop-nav">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} style={{ color: link.color, textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold' }}>
              {t(link.labelKey)}
            </Link>
          ))}
        </div>

        {/* Destra: lingua + wallet + hamburger */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

          {/* Lingua */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '7px 10px', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              {languageFlags[language].flag} {languageFlags[language].name}
              <span style={{ fontSize: '0.7rem' }}>▼</span>
            </button>
            {showLangDropdown && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '5px', background: '#1a1b23', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden', zIndex: 1001, minWidth: '120px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                {Object.entries(languageFlags).map(([code, { flag, name }]) => (
                  <button
                    key={code}
                    onClick={() => { setLanguage(code as Language); setShowLangDropdown(false); }}
                    style={{ display: 'block', width: '100%', padding: '9px 14px', background: language === code ? 'rgba(0,240,255,0.1)' : 'transparent', border: 'none', color: '#fff', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem' }}
                  >
                    {flag} {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wallet — nascosto su mobile piccolo */}
          <div className="desktop-wallet">
            <ConnectButton />
          </div>

          {/* Hamburger — visibile solo su mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hamburger-btn"
            style={{ display: 'none', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', color: '#fff', fontSize: '1.3rem', lineHeight: 1 }}
            aria-label="Menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Menu mobile — appare sotto la navbar quando aperto */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: '73px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(13,15,26,0.98)',
          backdropFilter: 'blur(16px)',
          zIndex: 998,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          gap: '8px',
          overflowY: 'auto',
        }}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: link.color,
                textDecoration: 'none',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                padding: '16px 20px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'block',
              }}
            >
              {t(link.labelKey)}
            </Link>
          ))}

          {/* Wallet nel menu mobile */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <ConnectButton />
          </div>
        </div>
      )}

      {/* CSS in-component per gestire desktop vs mobile */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav    { display: none !important; }
          .desktop-wallet { display: none !important; }
          .hamburger-btn  { display: block !important; }
        }
        @media (min-width: 769px) {
          .hamburger-btn  { display: none !important; }
          .desktop-wallet { display: block !important; }
        }
      `}</style>
    </>
  );
}
