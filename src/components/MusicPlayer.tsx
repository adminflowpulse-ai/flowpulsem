"use client";
import { useEffect, useRef, useState } from "react";

export default function MusicPlayer({ currentTrack, isPlaying, togglePlay }: any) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!audioRef.current && currentTrack) {
      audioRef.current = new Audio(currentTrack.audioUrl);
      audioRef.current.addEventListener('timeupdate', () => {
        setProgress(audioRef.current!.currentTime);
      });
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current!.duration);
      });
      audioRef.current.addEventListener('ended', () => {
        togglePlay(false);
      });
    }

    if (audioRef.current) {
      if (audioRef.current.src !== currentTrack?.audioUrl && currentTrack) {
        audioRef.current.src = currentTrack.audioUrl;
        audioRef.current.play();
        if (!isPlaying) togglePlay(true);
      } else {
        if (isPlaying) {
          audioRef.current.play().catch(e => console.log("Audio play blocked", e));
        } else {
          audioRef.current.pause();
        }
      }
    }
  }, [currentTrack, isPlaying]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0'+secs : secs}`;
  };

  const handleSeek = (e: any) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percent = clickX / rect.width;
      audioRef.current.currentTime = percent * duration;
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="glass-panel" style={{
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '900px',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 1000,
      borderRadius: '50px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', width: '250px' }}>
        <div className="pulse-disc" style={{ 
            width: '55px', height: '55px', borderRadius: '50%', 
            background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', animation: isPlaying ? 'spin 3s linear infinite' : 'none' 
        }}>
          💿
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentTrack.title}</h4>
          <p style={{ margin: 0, color: 'var(--accent-secondary)', fontSize: '0.9rem' }}>{currentTrack.artist}</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.5rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-main)'}>⏮</button>
        
        <button onClick={() => togglePlay(!isPlaying)} className="btn-primary" style={{ width: '55px', height: '55px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '1.5rem' }}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        
        <button style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.5rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-main)'}>⏭</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '250px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', width: '35px' }}>{formatTime(progress)}</span>
        <div onClick={handleSeek} style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', position: 'relative', cursor: 'pointer' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${duration ? (progress/duration)*100 : 0}%`, background: 'var(--accent-secondary)', borderRadius: '3px', boxShadow: '0 0 10px var(--accent-secondary)', transition: 'width 0.1s linear' }}></div>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', width: '35px' }}>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
