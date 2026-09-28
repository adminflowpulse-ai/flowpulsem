'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'it' | 'en';
type Translations = Record<string, Record<Language, string>>;

const translations: Translations = {
  'La Nuova Era dell''Industria Musicale': { it: 'La Nuova Era dell''Industria Musicale', en: 'The New Era of the Music Industry' },
  'Accesso Anticipato Chiuso': { it: 'Accesso Anticipato Chiuso', en: 'Early Access Closed' },
  'Benvenuto a Bordo!': { it: 'Benvenuto a Bordo!', en: 'Welcome Aboard!' },
  'Questa email è già in lista d''attesa!': { it: 'Questa email è già in lista d''attesa!', en: 'This email is already on the waitlist!' },
  'Errore di connessione. Riprova.': { it: 'Errore di connessione. Riprova.', en: 'Connection error. Please try again.' },
  'La tua email': { it: 'La tua email', en: 'Your email' },
  'è stata aggiunta alla lista prioritaria.': { it: 'è stata aggiunta alla lista prioritaria.', en: 'has been added to the priority list.' },
  'Ti contatteremo non appena i server saranno aperti al pubblico.': { it: 'Ti contatteremo non appena i server saranno aperti al pubblico.', en: 'We will contact you as soon as the servers are open to the public.' },
  'La piattaforma è attualmente in fase di Closed Beta.': { it: 'La piattaforma è attualmente in fase di Closed Beta.', en: 'The platform is currently in Closed Beta.' },
  'Lascia la tua email per entrare in lista d''attesa.': { it: 'Lascia la tua email per entrare in lista d''attesa.', en: 'Leave your email to join the waitlist.' },
  'La tua email (es. dj@gmail.com)': { it: 'La tua email (es. dj@gmail.com)', en: 'Your email (e.g. dj@gmail.com)' },
  'Iscrizione in corso...': { it: 'Iscrizione in corso...', en: 'Joining...' },
  'Mettimi in Lista d''Attesa': { it: 'Mettimi in Lista d''Attesa', en: 'Join Waitlist' },
  'Accesso Web3': { it: 'Accesso Web3', en: 'Web3 Access' },
  '🎧 SONO UN DJ (Connetti Wallet)': { it: '🎧 SONO UN DJ (Connetti Wallet)', en: '🎧 I AM A DJ (Connect Wallet)' },
  '🎵 SONO UN FAN (Connetti Wallet)': { it: '🎵 SONO UN FAN (Connetti Wallet)', en: '🎵 I AM A FAN (Connect Wallet)' },
  'Mercato': { it: 'Mercato', en: 'Market' },
  'Esplora': { it: 'Esplora', en: 'Explore' }
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'it',
  toggleLanguage: () => {},
  t: (k) => k
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('it');

  useEffect(() => {
    const saved = localStorage.getItem('fpm-lang') as Language;
    if (saved) setLanguage(saved);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'it' ? 'en' : 'it';
    setLanguage(newLang);
    localStorage.setItem('fpm-lang', newLang);
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);