"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MeetPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const endCall = () => {
    router.push('/');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', color: 'white', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1 className="text-gradient" style={{ margin: 0, fontSize: '1.5rem' }}>FlowPulseM <span style={{ color: 'white' }}>| Diamond 1-on-1</span></h1>
          <span style={{ background: '#00f0ff', color: 'black', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold' }}>Secured by Web3 (E2E)</span>
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: timeLeft < 300 ? '#ff3366' : 'white' }}>
          ⏱️ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Video Grid */}
      <div style={{ flex: 1, padding: '2rem', display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        
        {/* DJ Video (Main) */}
        <div style={{ 
          flex: '2 1 600px', height: '60vh', background: '#111', borderRadius: '15px', border: '2px solid #8a2be2', 
          position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(138, 43, 226, 0.2)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          backgroundImage: 'url("https://via.placeholder.com/800x600/111111/8a2be2?text=Sven+Vath+Camera")',
          backgroundSize: 'cover'
        }}>
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.7)', padding: '10px 20px', borderRadius: '10px', backdropFilter: 'blur(10px)' }}>
            <span style={{ color: '#00f0ff', fontWeight: 'bold', fontSize: '1.2rem' }}>Sven Vath</span>
            <span style={{ marginLeft: '10px', color: '#ccc', fontSize: '0.9rem' }}>Host (DJ)</span>
          </div>
        </div>

        {/* Fan Video (Self) */}
        <div style={{ 
          flex: '1 1 300px', height: '60vh', background: '#1a1a1a', borderRadius: '15px', border: '2px solid #FFD700', 
          position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(255, 215, 0, 0.2)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          backgroundImage: camOn ? 'url("https://via.placeholder.com/400x600/222222/FFD700?text=You")' : 'none',
          backgroundSize: 'cover'
        }}>
          {!camOn && <div style={{ fontSize: '4rem' }}>👤</div>}
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.7)', padding: '8px 15px', borderRadius: '10px', backdropFilter: 'blur(10px)' }}>
            <span style={{ color: '#FFD700', fontWeight: 'bold' }}>💎 TechnoFan_99 (You)</span>
            {!micOn && <span style={{ marginLeft: '10px', color: '#ff3366' }}>🔇 Muted</span>}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', background: 'linear-gradient(to top, #000, transparent)' }}>
        <button 
          onClick={() => setMicOn(!micOn)}
          style={{ width: '60px', height: '60px', borderRadius: '50%', background: micOn ? 'rgba(255,255,255,0.1)' : '#ff3366', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          {micOn ? '🎤' : '🔇'}
        </button>
        <button 
          onClick={() => setCamOn(!camOn)}
          style={{ width: '60px', height: '60px', borderRadius: '50%', background: camOn ? 'rgba(255,255,255,0.1)' : '#ff3366', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          {camOn ? '📷' : '🚫'}
        </button>
        <button 
          onClick={endCall}
          style={{ padding: '0 30px', height: '60px', borderRadius: '30px', background: '#ff3366', border: 'none', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 15px rgba(255,51,102,0.5)' }}
        >
          Leave Session
        </button>
      </div>
    </div>
  );
}
