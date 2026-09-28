"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const artists = [
  {
    id: 1,
    name: "Davide Squillace",
    genre: "Tech House / Techno",
    image: "https://images.unsplash.com/photo-1571266028243-cb40fce7573b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tokenPrice: "0.01",
    marketCap: "100.000",
    slug: "davidesquillace"
  }
];

export default function ArtistsPage() {
  return (
    <div className="container">
      <Navbar />
      <main style={{ padding: '2rem 0' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>Exclusive Roster</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-main)', marginBottom: '3rem' }}>Investi direttamente nei top player mondiali. 0% Commissioni.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {artists.map(artist => (
            <div key={artist.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden', transition: 'transform 0.3s' }}>
              <div style={{ height: '200px', backgroundImage: `url(${artist.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.5rem' }}>{artist.name}</h3>
                <p style={{ color: 'var(--accent-secondary)', margin: '0 0 15px 0', fontSize: '0.9rem' }}>{artist.genre}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main)' }}>Token Price</p>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{artist.tokenPrice} <img src="/coin.jpg" alt="FPM" style={{ height: "1em", borderRadius: "50%", verticalAlign: "middle" }} /></span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main)' }}>Market Cap</p>
                    <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{artist.marketCap} <img src="/coin.jpg" alt="FPM" style={{ height: "1em", borderRadius: "50%", verticalAlign: "middle" }} /></span>
                  </div>
                </div>

                <Link href={`/dj/${artist.slug}`} style={{ display: 'block', textAlign: 'center', background: 'var(--accent-gradient)', color: '#fff', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                  Accedi all'Oval Office
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}