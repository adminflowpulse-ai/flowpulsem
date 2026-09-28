"use client";
import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import * as Tone from 'tone';

const feedPosts = [
  {
    id: 1,
    author: "Davide Squillace",
    handle: "@davidesquillace",
    avatar: "https://images.unsplash.com/photo-1571266028243-cb40fce7573b?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
    time: "2 ore fa",
    content: "Studio session finita. Ho appena mintato gli Stems della nuova traccia 'Ibiza Sunrise'. Chi detiene il mio Fan Token può scaricarli in alta qualità ora. 🔥",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    audio: true,
    likes: 1205,
    comments: 342,
    price: "15.00",
    locked: false
  },
  {
    id: 2,
    author: "Davide Squillace",
    handle: "@davidesquillace",
    avatar: "https://images.unsplash.com/photo-1571266028243-cb40fce7573b?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
    time: "5 ore fa",
    content: "Live dal DC10. Energia incredibile stanotte. Questo ID esclusivo è disponibile solo per i possessori della mia SubCoin. 🚀",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    audio: false,
    likes: 3400,
    comments: 890,
    price: "50.00",
    locked: true
  }
];

export default function FlowFeed() {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const synthRef = useRef<Tone.Synth | null>(null);
  const loopRef = useRef<Tone.Loop | null>(null);

  const togglePlay = async (id: number) => {
    await Tone.start();
    
    if (playingId === id) {
      Tone.Transport.stop();
      setPlayingId(null);
      return;
    }

    if (!synthRef.current) {
      synthRef.current = new Tone.Synth().toDestination();
      loopRef.current = new Tone.Loop((time) => {
        synthRef.current?.triggerAttackRelease("C3", "8n", time);
      }, "4n");
    }

    Tone.Transport.bpm.value = 126;
    Tone.Transport.start();
    loopRef.current?.start(0);
    setPlayingId(id);
  };

  return (
    <div className="container" style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <Navbar />
      
      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', margin: 0 }}>Flow Feed</h1>
          <button style={{ background: 'transparent', border: '1px solid var(--accent-blue)', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>+</button>
        </div>

        {feedPosts.map(post => (
          <div key={post.id} style={{ background: 'var(--surface-color)', borderRadius: '15px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            
            {/* Header Post */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
              <img src={post.avatar} alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {post.author} <span style={{ color: 'var(--accent-blue)', fontSize: '1rem' }}>✓</span>
                </h3>
                <span style={{ color: 'var(--text-main)', fontSize: '0.8rem' }}>{post.time}</span>
              </div>
            </div>

            {/* Contenuto Testuale */}
            <p style={{ fontSize: '1rem', lineHeight: '1.5', marginBottom: '1rem' }}>{post.content}</p>

            {/* Immagine Stile Instagram */}
            {post.image && (
              <div style={{ position: 'relative', width: '100%', height: '350px', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
                <img src={post.image} alt="Post media" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: post.locked ? 'blur(10px)' : 'none' }} />
                
                {post.locked && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.5)' }}>
                    <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</span>
                    <p style={{ margin: '0 0 1rem', fontWeight: 'bold' }}>Contenuto Esclusivo Holders</p>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      Sblocca con {post.price} <img src="/coin.jpg" alt="FPM" style={{ height: "1.2em", borderRadius: "50%" }} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Audio Player (se non bloccato) */}
            {post.audio && !post.locked && (
              <div style={{ background: '#111', padding: '15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem', border: '1px solid #333' }}>
                <button onClick={() => togglePlay(post.id)} style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent-gradient)', border: 'none', color: '#fff', fontSize: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                  {playingId === post.id ? '⏸' : '▶'}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ height: '4px', background: '#333', borderRadius: '2px', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: playingId === post.id ? '40%' : '0%', background: 'var(--accent-green)', borderRadius: '2px', transition: 'width 0.1s linear' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Social Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                  ❤️ <span style={{ fontSize: '1rem' }}>{post.likes}</span>
                </button>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                  💬 <span style={{ fontSize: '1rem' }}>{post.comments}</span>
                </button>
              </div>
              
              {!post.locked && (
                <button style={{ background: 'rgba(27, 97, 255, 0.2)', border: '1px solid var(--accent-blue)', color: '#fff', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  Supporta {post.price} <img src="/coin.jpg" alt="FPM" style={{ height: "1.2em", borderRadius: "50%" }} />
                </button>
              )}
            </div>

          </div>
        ))}
      </main>

      {/* Bottom Mobile Tab Bar (Mock) */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '60px', background: 'rgba(13, 15, 26, 0.9)', backdropFilter: 'blur(10px)', borderTop: '1px solid #333', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 1000 }}>
        <span style={{ fontSize: '1.5rem', color: 'var(--accent-blue)' }}>🏠</span>
        <span style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>🔍</span>
        <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', color: '#fff', transform: 'translateY(-10px)', boxShadow: '0 5px 15px rgba(0,255,51,0.3)' }}>+</div>
        <span style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>🎧</span>
        <span style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>👤</span>
      </div>
    </div>
  );
}