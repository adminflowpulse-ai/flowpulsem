"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const allTracks = [
  { id: 1, title: 'Ibiza Sunrise', artist: 'Davide Squillace', price: '50', genre: 'Tech House' },
  { id: 2, title: 'Oval Office Mix', artist: 'Davide Squillace', price: '75', genre: 'Techno' },
  { id: 3, title: 'Afterhours (Stem Pack)', artist: 'Davide Squillace', price: '120', genre: 'Tech House' }
];

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTracks = allTracks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <Navbar />
      <main style={{ padding: '2rem 0' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>Esplora (Test Mode: Squillace)</h1>
        
        <div style={{ maxWidth: '600px', margin: '0 auto 3rem', display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Cerca tracce o stems..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', color: '#fff' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {filteredTracks.map(track => (
            <div key={track.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{track.title}</h3>
                  <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.9rem' }}>{track.artist}</p>
                </div>
                <span style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.7rem' }}>{track.genre}</span>
              </div>
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-highlight)' }}>
                  {track.price} <img src="/coin.jpg" alt="FPM" style={{ height: "1em", borderRadius: "50%", verticalAlign: "middle" }} />
                </span>
                <button className="btn-primary" style={{ padding: '8px 20px', borderRadius: '20px' }}>
                  Acquista
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}