"use client";
import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import { supabase } from '@/lib/supabase';
import { useAccount } from 'wagmi';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('fan');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      if (isConnected && address) {
        const { data, error } = await supabase
          .from('flowpulse_users')
          .select('username, avatar_url, bio, role')
          .eq('wallet_address', address)
          .single();
        
        if (data) {
          setUsername(data.username || '');
          setAvatarUrl(data.avatar_url || '');
          setBio(data.bio || '');
          setRole(data.role || 'fan');
        }
      }
    }
    loadProfile();
  }, [address, isConnected]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) return;
    
    setIsSaving(true);
    setMessage('');

    const { error } = await supabase
      .from('flowpulse_users')
      .update({ username, avatar_url: avatarUrl, bio })
      .eq('wallet_address', address);

    if (error) {
      setMessage('Errore durante il salvataggio: ' + error.message);
    } else {
      setMessage('Profilo aggiornato con successo!');
    }
    setIsSaving(false);
  };

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Il Tuo Profilo</h1>
        <p style={{ color: 'var(--text-main)', marginBottom: '3rem' }}>Personalizza la tua identità su FlowPulseM</p>

        {isConnected ? (
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Anteprima Avatar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%', 
                background: avatarUrl ? `url(${avatarUrl}) center/cover` : 'linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))',
                border: '3px solid var(--surface-color)',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: avatarUrl ? '0' : '3rem'
              }}>
                {!avatarUrl && '👤'}
              </div>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Ruolo: {role}
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Nome o Pseudonimo (Username)</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Es. Carl Cox, o SuperFan99"
                  style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#ccc', fontSize: '0.9rem' }}>URL Foto Profilo (Avatar)</label>
                <input 
                  type="text" 
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://link-alla-tua-foto.jpg"
                  style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Biografia</label>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Racconta qualcosa di te o della tua musica..."
                  style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '100%', minHeight: '100px', resize: 'vertical' }}
                />
              </div>

              <button type="submit" disabled={isSaving} className="btn-primary" style={{ marginTop: '1rem', padding: '15px', width: '100%', opacity: isSaving ? 0.7 : 1 }}>
                {isSaving ? 'Salvataggio...' : 'Salva Modifiche'}
              </button>

              {message && (
                <div style={{ marginTop: '1rem', padding: '10px', borderRadius: '5px', textAlign: 'center', background: message.includes('Errore') ? 'rgba(255,0,0,0.2)' : 'rgba(0,255,0,0.2)', color: message.includes('Errore') ? '#ff4a4a' : '#4aff4a' }}>
                  {message}
                </div>
              )}
            </form>

          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 1rem 0' }}>Wallet Disconnesso</h2>
            <p style={{ color: '#888' }}>Devi collegare il tuo portafoglio Web3 per poter modificare il tuo profilo.</p>
          </div>
        )}
      </main>
    </div>
  );
}
