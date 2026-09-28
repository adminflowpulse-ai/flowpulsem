import React, { useState } from 'react';
import { audioEngine } from '@/lib/audio/AudioEngine';

export interface ClipData {
    start: number;
    width: number;
    label: string;
}

export interface TrackData {
    name: string;
    color: string;
    clips: ClipData[];
    isAudio?: boolean;
    isMIDI?: boolean;
    isMaster?: boolean;
}

interface TrackProps {
    index: number;
    data: TrackData;
    onAddClip?: (trackIndex: number, startPercentage: number, soundName: string) => void;
    onMoveClip?: (fromTrack: number, clipIndex: number, toTrack: number, newStart: number) => void;
}

const GRID_STEPS = 32;

export default function Track({ index, data, onAddClip, onMoveClip }: TrackProps) {
    const { name, color, clips, isAudio, isMIDI, isMaster } = data;
    
    const [isSolo, setIsSolo] = useState(false);
    const [isMute, setIsMute] = useState(false);
    const [isArmed, setIsArmed] = useState(false);
    const [volume, setVolume] = useState(75);
    const [pan, setPan] = useState(50);
    const [isPlayingTrack, setIsPlayingTrack] = useState(false);

    const handleStripPlay = () => {
        setIsPlayingTrack(!isPlayingTrack);
        if (!isPlayingTrack) {
            audioEngine.triggerSynth(name.toLowerCase(), isAudio ? 200 : 440);
        }
    };

    const handleClipDragStart = (e: React.DragEvent, clipIndex: number) => {
        e.dataTransfer.setData('move_clip', JSON.stringify({ trackIndex: index, clipIndex }));
    };

    const handleTimelineDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const rawPercentage = (x / rect.width) * 100;
        
        // Quantize (snap) to grid!
        const stepSize = 100 / GRID_STEPS;
        const percentage = Math.round(rawPercentage / stepSize) * stepSize;

        const browserSound = e.dataTransfer.getData('browser_sound');
        if (browserSound && onAddClip) {
            onAddClip(index, percentage, browserSound);
            return;
        }

        const moveClipData = e.dataTransfer.getData('move_clip');
        if (moveClipData && onMoveClip) {
            const parsed = JSON.parse(moveClipData);
            onMoveClip(parsed.trackIndex, parsed.clipIndex, index, percentage);
        }
    };

    return (
      <div style={{ display: 'flex', height: '85px', borderBottom: '1px solid #2a2a2a', backgroundColor: '#1e1e1e' }}>
         {/* Track Header / Controls */}
         <div style={{ width: '300px', backgroundColor: isMaster ? '#333' : '#252525', borderRight: '1px solid #111', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <button 
                        onClick={handleStripPlay} 
                        style={{ background: 'transparent', border: 'none', color: isPlayingTrack ? '#1DB954' : color, cursor: 'pointer', outline: 'none', fontSize: '1rem', padding: 0 }}
                    >
                        {isPlayingTrack ? '⏸' : '▶'}
                    </button>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#eee' }}>{name}</span>
                 </div>
                 {isAudio && <span style={{ fontSize: '0.7rem', color: '#888', border: '1px solid #444', padding: '2px 4px', borderRadius: '3px' }}>Audio</span>}
                 {isMIDI && <span style={{ fontSize: '0.7rem', color: '#888', border: '1px solid #444', padding: '2px 4px', borderRadius: '3px' }}>MIDI</span>}
             </div>
             
             {!isMaster && (
                 <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                     <div onClick={() => setIsMute(!isMute)} style={{ width: '22px', height: '22px', background: isMute ? '#444' : '#FFD700', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: isMute ? '#888' : '#000', fontWeight: 'bold', cursor: 'pointer' }}>1</div>
                     <div onClick={() => setIsSolo(!isSolo)} style={{ width: '22px', height: '22px', background: isSolo ? '#00f0ff' : '#444', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', cursor: 'pointer', color: isSolo ? '#000' : '#fff' }}>S</div>
                     <div onClick={() => setIsArmed(!isArmed)} style={{ width: '22px', height: '22px', background: isArmed ? '#ff3366' : '#444', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', cursor: 'pointer', color: isArmed ? '#fff' : '#ff3366' }}>O</div>
                     
                     <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <span style={{ fontSize: '0.6rem', color: '#888' }}>{pan > 50 ? 'R' : pan < 50 ? 'L' : 'C'}</span>
                        <input type="range" min="0" max="100" value={pan} onChange={(e) => setPan(Number(e.target.value))} style={{ width: '40px', height: '4px', cursor: 'pointer' }} />
                     </div>
                 </div>
             )}
  
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' }}>
                 <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} style={{ flex: 1, cursor: 'pointer' }} />
                 <span style={{ fontSize: '0.8rem', color: '#888', width: '35px', textAlign: 'right' }}>{(volume - 80).toFixed(1)}</span>
             </div>
         </div>
  
         {/* Track Timeline Area (Quantized Grid) */}
         <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleTimelineDrop}
            style={{ 
               flex: 1, 
               position: 'relative', 
               backgroundColor: '#1a1a1a',
               display: 'flex'
            }}
         >
             {Array.from({ length: GRID_STEPS }).map((_, i) => (
                 <div 
                    key={i} 
                    style={{ 
                        flex: 1, 
                        borderRight: '1px solid rgba(255,255,255,0.05)', 
                        borderBottom: '1px solid rgba(255,255,255,0.02)',
                        background: i % 4 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent', 
                        height: '100%',
                        boxSizing: 'border-box'
                    }} 
                 />
             ))}
  
             {/* Clips */}
             {clips.map((clip, i) => (
                 <div key={i} draggable onDragStart={(e) => handleClipDragStart(e, i)} style={{ 
                     position: 'absolute', 
                     top: '10px', 
                     bottom: '10px', 
                     left: `${clip.start}%`, 
                     width: `${clip.width}%`, 
                     backgroundColor: color,
                     borderRadius: '4px',
                     border: `1px solid ${color}`,
                     borderTop: '5px solid rgba(255,255,255,0.5)',
                     opacity: 0.85,
                     display: 'flex',
                     alignItems: 'center',
                     overflow: 'hidden',
                     cursor: 'grab'
                 }}>
                    {isAudio ? (
                      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <span style={{ position: 'absolute', top: '2px', left: '5px', fontSize: '0.7rem', color: '#fff', fontWeight: 'bold', zIndex: 2 }}>
                          {clip.label || 'Audio Clip'}
                        </span>
                        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ opacity: 0.6 }}>
                          <path d="M 0 50 Q 5 10, 10 50 T 20 50 T 30 50 T 40 50 T 50 50 T 60 50 T 70 50 T 80 50 T 90 50 T 100 50" stroke="#000" strokeWidth="1" fill="none" />
                          <path d="M 0 50 Q 5 90, 10 50 T 20 50 T 30 50 T 40 50 T 50 50 T 60 50 T 70 50 T 80 50 T 90 50 T 100 50" stroke="#000" strokeWidth="1" fill="none" />
                        </svg>
                      </div>
                    ) : (
                      <div style={{ width: '100%', height: '100%', position: 'relative', opacity: 0.7 }}>
                         <div style={{ position: 'absolute', top: '20%', left: '10%', width: '10%', height: '10%', background: '#000' }}></div>
                         <div style={{ position: 'absolute', top: '40%', left: '30%', width: '10%', height: '10%', background: '#000' }}></div>
                         <div style={{ position: 'absolute', top: '60%', left: '50%', width: '20%', height: '10%', background: '#000' }}></div>
                         <div style={{ position: 'absolute', top: '30%', left: '80%', width: '10%', height: '10%', background: '#000' }}></div>
                      </div>
                    )}
                 </div>
             ))}
         </div>
      </div>
    );
}
