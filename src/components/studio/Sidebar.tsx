import React, { useState } from 'react';
import { audioEngine } from '@/lib/audio/AudioEngine';

export default function Sidebar() {
    const [expandedFolder, setExpandedFolder] = useState<string | null>('Sounds');
    const [isUploading, setIsUploading] = useState(false);

    const handlePreview = (type: string, pitch: number) => {
        audioEngine.triggerSynth(type, pitch);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload-audio', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          alert('1/2: Caricato su Amazon AWS con successo!\nInvio all\'Oracolo AI in corso...');
          
          // Chiama Replicate
          const oracleRes = await fetch('/api/oracle', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ audioUrl: data.url })
          });
          const oracleData = await oracleRes.json();
          if (oracleData.success) {
             alert('2/2: L\'Oracolo ha smembrato il brano!\n' + JSON.stringify(oracleData.stems, null, 2));
             console.log(oracleData.stems);
          } else {
             alert('Errore Oracolo: ' + oracleData.error);
          }

        } else {
          alert('Errore AWS: ' + data.error);
        }
      } catch (err) {
        alert('Errore di rete AWS o AI');
      }
      setIsUploading(false);
    };

    return (
        <div style={{ width: '280px', backgroundColor: '#252525', borderRight: '1px solid #111', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '15px', fontWeight: 'bold', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span>Browser</span>
            </div>
            
            <div style={{ padding: '15px', borderBottom: '1px solid #333' }}>
              <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '10px', marginTop: 0 }}>Carica audio in AWS S3</p>
              <input 
                type="file" 
                accept="audio/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                style={{ width: '100%', fontSize: '0.7rem', color: '#ccc' }}
              />
              {isUploading && <span style={{ fontSize: '0.7rem', color: '#1DB954', display: 'block', marginTop: '5px' }}>Caricamento in corso...</span>}
            </div>

            <div style={{ padding: '15px', flex: 1, overflowY: 'auto', fontSize: '0.9rem', color: '#bbb' }}>
               <div onClick={() => setExpandedFolder(expandedFolder === 'Sounds' ? null : 'Sounds')} className="browser-item" style={{ marginBottom: '8px', cursor: 'pointer', display: 'flex', gap: '10px' }}>
                 <span>{expandedFolder === 'Sounds' ? '📂' : '📁'}</span> Suoni di Base
               </div>
               
               {expandedFolder === 'Sounds' && (
                 <div style={{ paddingLeft: '30px', fontSize: '0.8rem', color: '#999', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                   <div draggable onDragStart={(e) => e.dataTransfer.setData('browser_sound', 'Deep Tech Bassline A')} onClick={() => handlePreview('bass', 110)} style={{ cursor: 'pointer' }}>🎵 Deep Tech Bassline A.wav</div>
                   <div draggable onDragStart={(e) => e.dataTransfer.setData('browser_sound', 'Rumble Sub 128')} onClick={() => handlePreview('sub', 65)} style={{ cursor: 'pointer' }}>🎵 Rumble Sub 128.wav</div>
                   <div draggable onDragStart={(e) => e.dataTransfer.setData('browser_sound', 'Atmospheric Pad')} onClick={() => handlePreview('pad', 220)} style={{ cursor: 'pointer' }}>🎵 Atmospheric Pad.wav</div>
                   <div draggable onDragStart={(e) => e.dataTransfer.setData('browser_sound', 'Vocal Chop FX_01')} onClick={() => handlePreview('vocal', 440)} style={{ cursor: 'pointer' }}>🎵 Vocal Chop FX_01.wav</div>
                   <div draggable onDragStart={(e) => e.dataTransfer.setData('browser_sound', 'Kick 909 Deep')} onClick={() => handlePreview('kick', 150)} style={{ cursor: 'pointer' }}>🎵 Kick 909 Deep.wav</div>
                 </div>
               )}
            </div>
        </div>
    );
}
