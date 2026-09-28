"use client";
import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import { supabase } from '@/lib/supabase';

export default function MarketplacePage() {
  const [filter, setFilter] = useState('All');
  const [tracks, setTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTracks() {
      const { data, error } = await supabase.from('marketplace_tracks').select('*').order('created_at', { ascending: false });
      if (data) {
        setTracks(data);
      }
      setIsLoading(false);
    }
    loadTracks();
  }, []);

  const filteredTracks = filter === 'All' ? tracks : tracks.filter(t => t.status === filter || t.type === filter);


  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '1rem', paddingBottom: '120px' }}>
      <Navbar />

      <main style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', margin: 0 }}>Decentralized <span className="text-gradient">Marketplace</span></h1>
            <p style={{ color: 'var(--text-main)', marginTop: '10px' }}>Compra, scambia brani e Stems. L'economia decentralizzata dei remix.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', background: filter === 'All' ? 'var(--accent-primary)' : 'var(--surface-color)' }} onClick={() => setFilter('All')}>All Tracks</button>
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', background: filter === 'Trending' ? 'var(--accent-primary)' : 'var(--surface-color)' }} onClick={() => setFilter('Trending')}>Trending</button>
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', background: filter === 'Stem' ? '#00f0ff' : 'var(--surface-color)', color: filter === 'Stem' ? '#000' : 'white' }} onClick={() => setFilter('Stem')}>Stems (Remix)</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {filteredTracks.map(track => (
            <div key={track.id} className="glass-panel track-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '100%', height: '180px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '10px', right: '10px', background: track.type === 'Stem' ? '#00f0ff' : 'var(--accent-primary)', color: track.type === 'Stem' ? '#000' : 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {track.type}
                </span>
                <span style={{ fontSize: '4rem' }}>{track.type === 'Stem' ? '🎛️' : '🎵'}</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{track.title}</h3>
              <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '8px' }}>{track.artist}</p>
              
              {track.type === 'Stem' && (
                <p style={{ fontSize: '0.8rem', color: '#00f0ff', background: 'rgba(0, 240, 255, 0.1)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '1rem' }}>
                  ⚙️ {track.royalty} (Smart Contract)
                </p>
              )}

              {/* Supporter Grid (Bandcamp Social Feature) */}
              <div style={{ marginTop: 'auto', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginBottom: '5px' }}>Top Supporters:</p>
                <div style={{ display: 'flex', marginLeft: '10px' }}>
                  {/* Obsidian Tier Fan */}
                  <div style={{ 
                    width: '28px', height: '28px', borderRadius: '50%', background: `hsl(280, 70%, 60%)`, marginLeft: '-10px', 
                    border: '2px solid #FFD700', boxShadow: '0 0 10px rgba(255, 215, 0, 0.8)', zIndex: 5, position: 'relative'
                  }}>
                    <span style={{ position: 'absolute', top: '-8px', right: '-5px', fontSize: '10px' }}>👑</span>
                  </div>
                  {/* Gold Tier Fan */}
                  <div style={{ 
                    width: '26px', height: '26px', borderRadius: '50%', background: `hsl(120, 70%, 60%)`, marginLeft: '-10px', 
                    border: '2px solid silver', boxShadow: '0 0 5px rgba(192, 192, 192, 0.8)', zIndex: 4 
                  }}></div>
                  {/* Regular Fans */}
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      style={{ 
                        width: '24px', height: '24px', borderRadius: '50%', background: `hsl(${Math.random() * 360}, 70%, 60%)`, marginLeft: '-10px', 
                        border: '2px solid var(--surface-color)', zIndex: 3 - i
                      }}
                    ></div>
                  ))}
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', marginLeft: '-10px', border: '2px solid var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', zIndex: 0 }}>
                    +42
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-secondary)' }}>{track.price} $FPM</span>
                <button className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>Acquista</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
