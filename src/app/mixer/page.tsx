"use client";
import React, { useState, useEffect, useRef } from 'react';
import Navbar from "@/components/Navbar";
import * as Tone from 'tone';

export default function MixerPage() {
  const [hasTokens] = useState(true);
  const [deckA] = useState("Demo Track 1");
  const [deckB] = useState("Demo Track 2");
  
  const [loaded, setLoaded] = useState(false);
  const [isPlayingA, setIsPlayingA] = useState(false);
  const [isPlayingB, setIsPlayingB] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const engineRef = useRef<any>(null);

  useEffect(() => {
    const initAudio = async () => {
      try {
        const crossFader = new Tone.CrossFade(0.5).toDestination();
        
        // Deck A Chain (Kick Drum)
        const eqA = new Tone.EQ3(0, 0, 0);
        const reverbA = new Tone.Freeverb(0.8, 1000);
        const delayA = new Tone.FeedbackDelay("8n", 0.5);
        const volA = new Tone.Volume(0); // Volume fader
        const pitchA = new Tone.PitchShift();
        reverbA.wet.value = 0;
        delayA.wet.value = 0;
        
        const synthA = new Tone.MembraneSynth().chain(pitchA, eqA, reverbA, delayA, volA, crossFader.a);
        const playerA = new Tone.Loop((time) => {
          synthA.triggerAttackRelease("C1", "8n", time);
        }, "4n");

        // Deck B Chain (Hi-Hat / Bass)
        const eqB = new Tone.EQ3(0, 0, 0);
        const reverbB = new Tone.Freeverb(0.8, 1000);
        const delayB = new Tone.FeedbackDelay("8n", 0.5);
        const volB = new Tone.Volume(0); // Volume fader
        const pitchB = new Tone.PitchShift();
        reverbB.wet.value = 0;
        delayB.wet.value = 0;
        
        const synthB = new Tone.MetalSynth({ envelope: { attack: 0.01, decay: 0.1, release: 0.01 } }).chain(pitchB, eqB, reverbB, delayB, volB, crossFader.b);
        const playerB = new Tone.Loop((time) => {
          synthB.triggerAttackRelease("16n", time);
        }, "8n");
        
        Tone.Transport.bpm.value = 128;

        setLoaded(true);

        engineRef.current = {
          playerA, playerB,
          synthA, synthB,
          eqA, eqB,
          reverbA, reverbB,
          delayA, delayB,
          pitchA, pitchB,
          volA, volB,
          crossFader
        };
      } catch (err: any) {
        setErrorMsg("Errore inizializzazione: " + err.message);
      }
    };
    initAudio();
    
    return () => {
      if(engineRef.current) {
         engineRef.current.playerA.dispose();
         engineRef.current.playerB.dispose();
         engineRef.current.synthA.dispose();
         engineRef.current.synthB.dispose();
      }
    };
  }, []);

  const handlePlayA = async () => {
    try {
      await Tone.start();
      if (!loaded || !engineRef.current) {
         setErrorMsg("Attendi il caricamento completo.");
         return;
      }
      Tone.Transport.start();
      if (isPlayingA) {
        engineRef.current.playerA.stop();
      } else {
        engineRef.current.playerA.start();
      }
      setIsPlayingA(!isPlayingA);
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg("Errore Play A: " + err.message);
    }
  };
  
  const handlePlayB = async () => {
    try {
      await Tone.start();
      if (!loaded || !engineRef.current) {
         setErrorMsg("Attendi il caricamento completo.");
         return;
      }
      Tone.Transport.start();
      if (isPlayingB) {
        engineRef.current.playerB.stop();
      } else {
        engineRef.current.playerB.start();
      }
      setIsPlayingB(!isPlayingB);
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg("Errore Play B: " + err.message);
    }
  };

  const handleSync = async () => {
    try {
      await Tone.start();
      if (!loaded || !engineRef.current) return;
      Tone.Transport.start();
      engineRef.current.playerB.stop();
      engineRef.current.playerA.stop();
      engineRef.current.playerA.start(0);
      engineRef.current.playerB.start(0);
      setIsPlayingA(true);
      setIsPlayingB(true);
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg("Errore Sync: " + err.message);
    }
  }

  const setVolume = (deck: 'A'|'B', val: number) => {
    if(!engineRef.current) return;
    const vol = deck === 'A' ? engineRef.current.volA : engineRef.current.volB;
    if (val === 0) {
      vol.volume.value = -Infinity;
    } else {
      vol.volume.value = (val - 80) * 0.5;
    }
  }

  const setCrossfade = (val: number) => {
    if(engineRef.current) engineRef.current.crossFader.fade.value = val / 100;
  }
  const setEQ = (deck: 'A'|'B', band: 'high'|'mid'|'low', val: number) => {
    if(!engineRef.current) return;
    const eq = deck === 'A' ? engineRef.current.eqA : engineRef.current.eqB;
    const db = (val - 50) * 0.4;
    eq[band].value = db;
  }
  const setPitch = (deck: 'A'|'B', val: number) => {
    if(!engineRef.current) return;
    const pitch = deck === 'A' ? engineRef.current.pitchA : engineRef.current.pitchB;
    pitch.pitch = ((val - 50) / 50) * 12;
  }
  const setReverb = (deck: 'A'|'B', val: number) => {
    if(!engineRef.current) return;
    const rev = deck === 'A' ? engineRef.current.reverbA : engineRef.current.reverbB;
    rev.wet.value = val / 100;
  }
  const setDelay = (deck: 'A'|'B', val: number) => {
    if(!engineRef.current) return;
    const del = deck === 'A' ? engineRef.current.delayA : engineRef.current.delayB;
    del.wet.value = val / 100;
  }

  const testBeep = async () => {
    try {
      await Tone.start();
      alert("STATO AUDIO: " + Tone.context.state + ". Se leggi 'running', il codice sta inviando l'audio alle casse.");
      const synth = new Tone.Synth().toDestination();
      synth.triggerAttackRelease("C4", "8n");
      synth.triggerAttackRelease("E4", "8n", "+0.2");
      synth.triggerAttackRelease("G4", "8n", "+0.4");
    } catch (e: any) {
      alert("ERRORE: " + e.message);
    }
  };

  if (!hasTokens) {
    return (
      <main className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
        <Navbar />
        <h1 className="text-gradient">Accesso Negato</h1>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0b0c10', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '2rem' }}>
        <Navbar />
      </div>

      <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Web3 Rekordbox (Pioneer Edition)</h1>
        
        {errorMsg && (
          <div style={{ background: 'red', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
            <strong>ERRORE AUDIO:</strong> {errorMsg}
          </div>
        )}

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px', alignItems: 'center' }}>
           <strong style={{ color: 'yellow' }}>⚠️ TEST AUDIO:</strong>
           <button onClick={testBeep} style={{ background: 'yellow', color: 'black', fontWeight: 'bold', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
              🔊 Clicca qui per sentire un BEEP
           </button>
           <span style={{ fontSize: '0.8rem', color: '#ccc' }}>Se non senti il BEEP, il tuo PC è mutato!</span>
           
           <div style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column' }}>
             <span style={{ fontSize: '0.7rem' }}>HTML5 Audio Backup</span>
             <audio src="/track1.mp3" controls style={{ height: '30px' }}></audio>
           </div>
        </div>
        
        <p style={{ color: 'var(--text-main)', marginBottom: '3rem' }}>
          {loaded ? "🟢 Motore Audio Pronto - Usa i fader e clicca Play!" : "🔴 Caricamento Motore Audio (Tone.js)..."}
        </p>

        <div style={{ display: 'flex', gap: '2rem', width: '100%', maxWidth: '1400px', justifyContent: 'center' }}>
          
          {/* Deck A */}
          <div className="glass-panel" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
            <h2 style={{ color: '#00f0ff', marginBottom: '20px' }}>DECK A</h2>
            
            <div style={{ width: '250px', height: '250px', borderRadius: '50%', background: '#1a1a1a', border: '5px solid #333', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: '20px', boxShadow: isPlayingA ? '0 0 30px rgba(0, 240, 255, 0.4)' : '0 0 20px rgba(0, 240, 255, 0.2)', transition: 'all 0.2s' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#00f0ff', opacity: 0.8 }}></div>
              <div style={{ position: 'absolute', top: 0, width: '4px', height: '120px', background: '#fff', transformOrigin: 'bottom center', animation: isPlayingA ? 'spin 2s linear infinite' : 'none' }}></div>
            </div>

            <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>Track Loaded:</p>
              <p style={{ margin: 0, fontWeight: 'bold', color: 'white' }}>{deckA}</p>
            </div>

            <div style={{ display: 'flex', gap: '15px', width: '100%', justifyContent: 'center', marginBottom: '20px' }}>
              <button onClick={handlePlayA} style={{ background: isPlayingA ? '#00f0ff' : '#333', color: isPlayingA ? 'black' : 'white', border: 'none', padding: '15px 25px', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem', transition: 'all 0.2s' }}>
                {isPlayingA ? '⏸ Pause' : '⏯ Play'}
              </button>
              <button onClick={()=>{if(engineRef.current) engineRef.current.playerA.stop(); setIsPlayingA(false);}} style={{ background: '#333', border: 'none', color: 'white', padding: '15px 25px', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem' }}>⏹ Cue</button>
            </div>
            
            {/* Pioneer-style FX A */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '10px' }}>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', marginBottom: '5px', color: '#00f0ff' }}>Reverb FX</span>
                  <input type="range" min="0" max="100" defaultValue="0" onChange={(e)=>setReverb('A', Number(e.target.value))} />
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', marginBottom: '5px', color: '#00f0ff' }}>Delay FX</span>
                  <input type="range" min="0" max="100" defaultValue="0" onChange={(e)=>setDelay('A', Number(e.target.value))} />
               </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', width: '100%', background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.8rem' }}>Pitch (-)</span>
              <input type="range" min="0" max="100" defaultValue="50" style={{ flex: 1 }} onChange={(e)=>setPitch('A', Number(e.target.value))} />
              <span style={{ fontSize: '0.8rem' }}>Pitch (+)</span>
            </div>
          </div>


          {/* Central Mixer Console */}
          <div className="glass-panel" style={{ width: '400px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)' }}>
            <h3 style={{ marginBottom: '20px', color: '#888' }}>PIONEER MIXER</h3>
            
            <button onClick={handleSync} style={{ background: '#444', color: 'white', border: '1px solid #666', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', marginBottom: '30px', width: '100%' }}>🔄 BEAT SYNC DECKS</button>

            <div style={{ display: 'flex', gap: '40px', flex: 1, width: '100%', justifyContent: 'center' }}>
              
              {/* Channel A STRIP */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', background: 'rgba(0, 240, 255, 0.05)', padding: '15px', borderRadius: '10px' }}>
                <span style={{ color: '#00f0ff', fontWeight: 'bold' }}>CH A</span>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '0.7rem' }}>HIGH</span><br/><input type="range" min="0" max="100" defaultValue="50" style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '60px' }} onChange={(e)=>setEQ('A', 'high', Number(e.target.value))} /></div>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '0.7rem' }}>MID</span><br/><input type="range" min="0" max="100" defaultValue="50" style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '60px' }} onChange={(e)=>setEQ('A', 'mid', Number(e.target.value))} /></div>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '0.7rem', color: '#00f0ff' }}>LOW</span><br/><input type="range" min="0" max="100" defaultValue="50" style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '60px' }} onChange={(e)=>setEQ('A', 'low', Number(e.target.value))} /></div>
                
                {/* VOLUME FADER A */}
                <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>VOLUME</span><br/>
                  <input type="range" min="0" max="100" defaultValue="80" style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '120px', cursor: 'pointer' }} onChange={(e)=>setVolume('A', Number(e.target.value))} />
                </div>
              </div>

              {/* Channel B STRIP */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', background: 'rgba(255, 51, 102, 0.05)', padding: '15px', borderRadius: '10px' }}>
                <span style={{ color: '#ff3366', fontWeight: 'bold' }}>CH B</span>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '0.7rem' }}>HIGH</span><br/><input type="range" min="0" max="100" defaultValue="50" style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '60px' }} onChange={(e)=>setEQ('B', 'high', Number(e.target.value))} /></div>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '0.7rem' }}>MID</span><br/><input type="range" min="0" max="100" defaultValue="50" style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '60px' }} onChange={(e)=>setEQ('B', 'mid', Number(e.target.value))} /></div>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '0.7rem', color: '#ff3366' }}>LOW</span><br/><input type="range" min="0" max="100" defaultValue="50" style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '60px' }} onChange={(e)=>setEQ('B', 'low', Number(e.target.value))} /></div>
                
                {/* VOLUME FADER B */}
                <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>VOLUME</span><br/>
                  <input type="range" min="0" max="100" defaultValue="80" style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '120px', cursor: 'pointer' }} onChange={(e)=>setVolume('B', Number(e.target.value))} />
                </div>
              </div>
            </div>

            {/* Crossfader */}
            <div style={{ width: '100%', marginTop: '40px', background: 'rgba(0,0,0,0.5)', padding: '20px 10px', borderRadius: '10px' }}>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888', margin: '0 0 10px 0' }}>CROSSFADER</p>
              <input type="range" min="0" max="100" defaultValue="50" style={{ width: '100%', height: '8px', cursor: 'pointer' }} onChange={(e)=>setCrossfade(Number(e.target.value))} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#666', marginTop: '5px' }}>
                 <span style={{ color: '#00f0ff' }}>A</span><span style={{ color: '#ff3366' }}>B</span>
              </div>
            </div>
          </div>


          {/* Deck B */}
          <div className="glass-panel" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255, 51, 102, 0.05)', border: '1px solid rgba(255, 51, 102, 0.2)' }}>
            <h2 style={{ color: '#ff3366', marginBottom: '20px' }}>DECK B</h2>
            
            <div style={{ width: '250px', height: '250px', borderRadius: '50%', background: '#1a1a1a', border: '5px solid #333', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: '20px', boxShadow: isPlayingB ? '0 0 30px rgba(255, 51, 102, 0.4)' : '0 0 20px rgba(255, 51, 102, 0.2)', transition: 'all 0.2s' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ff3366', opacity: 0.8 }}></div>
              <div style={{ position: 'absolute', top: 0, width: '4px', height: '120px', background: '#fff', transformOrigin: 'bottom center', animation: isPlayingB ? 'spin 2s linear infinite' : 'none' }}></div>
            </div>

            <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>Track Loaded:</p>
              <p style={{ margin: 0, fontWeight: 'bold', color: 'white' }}>{deckB}</p>
            </div>

            <div style={{ display: 'flex', gap: '15px', width: '100%', justifyContent: 'center', marginBottom: '20px' }}>
              <button onClick={handlePlayB} style={{ background: isPlayingB ? '#ff3366' : '#333', color: isPlayingB ? 'black' : 'white', border: 'none', padding: '15px 25px', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem', transition: 'all 0.2s' }}>
                {isPlayingB ? '⏸ Pause' : '⏯ Play'}
              </button>
              <button onClick={()=>{if(engineRef.current) engineRef.current.playerB.stop(); setIsPlayingB(false);}} style={{ background: '#333', border: 'none', color: 'white', padding: '15px 25px', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem' }}>⏹ Cue</button>
            </div>
            
            {/* Pioneer-style FX B */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '10px' }}>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', marginBottom: '5px', color: '#ff3366' }}>Reverb FX</span>
                  <input type="range" min="0" max="100" defaultValue="0" onChange={(e)=>setReverb('B', Number(e.target.value))} />
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', marginBottom: '5px', color: '#ff3366' }}>Delay FX</span>
                  <input type="range" min="0" max="100" defaultValue="0" onChange={(e)=>setDelay('B', Number(e.target.value))} />
               </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', width: '100%', background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.8rem' }}>Pitch (-)</span>
              <input type="range" min="0" max="100" defaultValue="50" style={{ flex: 1 }} onChange={(e)=>setPitch('B', Number(e.target.value))} />
              <span style={{ fontSize: '0.8rem' }}>Pitch (+)</span>
            </div>
          </div>

        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}} />

      </div>
    </main>
  );
}
