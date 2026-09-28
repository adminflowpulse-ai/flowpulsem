"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function syncUser() {
      if (isConnected && address) {
        const { data: user, error } = await supabase
          .from('flowpulse_users')
          .select('role')
          .eq('wallet_address', address)
          .single();
        
        if (!user) {
          const { data: newUser, error: insertError } = await supabase
            .from('flowpulse_users')
            .insert([{ wallet_address: address, role: 'fan' }])
            .select('role')
            .single();
          
          if (insertError) { alert('Errore Supabase su Navbar: ' + insertError.message); } if (newUser) setRole(newUser.role);
        } else {
          setRole(user.role);
        }
      } else {
        setRole(null);
      }
    }
    syncUser();
  }, [address, isConnected]);

  const handleLogout = () => {
    disconnect();
    setRole(null);
    window.location.href = "/";
  };

  return (
    <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '1rem 0', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: '10px', boxSizing: 'border-box' }}>
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <h1 style={{ fontFamily: "'Dancing Script', cursive", margin: 0, fontSize: 'clamp(2.2rem, 8vw, 3.2rem)', cursor: 'pointer', display: 'flex', alignItems: 'baseline', fontWeight: 700, letterSpacing: '2px' }}>
            <span style={{ background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-green))', WebkitBackgroundClip: 'text', color: 'transparent', paddingRight: '2px' }}>FlowPulse</span>
            <span style={{ color: 'var(--accent-red)', textShadow: '0 0 15px rgba(255,0,60,0.6)' }}>M</span>
            <sup style={{ color: 'var(--accent-red)', fontSize: 'clamp(0.8rem, 3vw, 1.2rem)', marginLeft: '4px', textShadow: 'none' }}>&reg;</sup>
          </h1>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          {role ? (
            <>
              <Link href={role === 'dj' ? '/dashboard/dj' : '/dashboard/fan'} className="nav-link" style={{ color: 'var(--accent-green)', fontWeight: 'bold', border: '1px solid var(--accent-green)', padding: '5px 15px', borderRadius: '20px' }}>
                {role === 'dj' ? 'Dashboard' : 'Collection'}
              </Link>
              <button onClick={handleLogout} style={{ background: 'transparent', color: '#ccc', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>Logout</button>
            </>
          ) : (
            <Link href="/login" className="nav-link" style={{ background: 'var(--accent-blue)', color: '#fff', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 0 10px rgba(27, 97, 255, 0.5)' }}>ACCEDI</Link>
          )}
          <ConnectButton />
        </div>
      </div>

      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', width: '100%', maxWidth: '100%', overflowX: 'auto', paddingBottom: '0.5rem', whiteSpace: 'nowrap', boxSizing: 'border-box' }}>
        <Link href="/" className="nav-link">Discover</Link><Link href="/profile" className="nav-link" style={{ color: "#fff", fontWeight: "bold", background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: "5px" }}>Profilo</Link>
        <Link href="/feed" className="nav-link" style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>Flow Feed</Link>
        <Link href="/artists" className="nav-link">Artists</Link>
        <Link href="/marketplace" className="nav-link">Marketplace</Link>
        <Link href="/compravendita" className="nav-link" style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>Compravendita</Link>
        <Link href="/mixer" className="nav-link" style={{ color: 'var(--accent-red)', fontWeight: 'bold' }}>Web3 Mixer</Link>
        <Link href="/drops" className="nav-link" style={{ color: 'var(--accent-green)' }}>Geo-Drops</Link>
        <Link href="/governance" className="nav-link" style={{ color: 'var(--accent-blue)' }}>DAO</Link>
        <Link href="/studio" className="nav-link" style={{ color: 'var(--accent-red)', fontWeight: 'bold' }}>Studio</Link>
        
      </nav>
    </header>
  );
}

