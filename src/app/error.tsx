'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error Boundary caught an error:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: '#0d0f1a',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
    }}>
      <h2 style={{ fontSize: '1.8rem', color: '#ff4a4a', marginBottom: '12px' }}>
        Si è verificato un errore
      </h2>
      <p style={{ color: '#aaa', maxWidth: '500px', marginBottom: '24px', lineHeight: 1.5 }}>
        {error?.message || 'Errore imprevisto durante il caricamento del componente.'}
      </p>
      <button
        onClick={() => reset()}
        style={{
          background: 'linear-gradient(135deg, #1b61ff, #00f0ff)',
          border: 'none',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '10px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Riprova
      </button>
    </div>
  );
}
