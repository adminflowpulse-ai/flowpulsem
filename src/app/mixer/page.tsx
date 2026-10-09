"use client";
import React, { useState, useEffect, useRef } from 'react';
import Navbar from "@/components/Navbar";
import * as Tone from 'tone';

const CANVAS_WIDTH = 15000;
// BPM originale di ogni traccia (modificabile): usato per sincronizzare delay/echo
const TRACK_BPM: Record<'A' | 'B', number> = { A: 126, B: 126 };
const DEFAULT_VOLUME_SLIDER = 80;
// Curva volume naturale, massimo 0 dB (niente boost che manda in distorsione)
const sliderToDb = (value: number) => value <= 0 ? -80 : Tone.gainToDb(Math.pow(value / 100, 2));

export default function MixerPage() {
  const [hasTokens] = useState(true);
  
  const [loaded, setLoaded] = useState(false);
  const [isPlayingA, setIsPlayingA] = useState(false);
  const [isPlayingB, setIsPlayingB] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeFxA, setActiveFxA] = useState<Record<string, boolean>>({});
  const [activeFxB, setActiveFxB] = useState<Record<string, boolean>>({});
  
  const [progressA, setProgressA] = useState(0);
  const [progressB, setProgressB] = useState(0);
  
  // Dragging states
  const [isDraggingA, setIsDraggingA] = useState(false);
  const [isDraggingB, setIsDraggingB] = useState(false);
  const dragStartX = useRef(0);
  const dragStartProgress = useRef(0);
  
  const engineRef = useRef<any>(null);
  const canvasARef = useRef<HTMLCanvasElement>(null);
  const canvasBRef = useRef<HTMLCanvasElement>(null);
  const rafRefA = useRef<number | null>(null);
  const rafRefB = useRef<number | null>(null);
  // Copia sincrona degli FX attivi: i side effect audio NON stanno dentro gli updater di setState
  const activeFxRef = useRef<{ A: Record<string, boolean>; B: Record<string, boolean> }>({ A: {}, B: {} });

  // Draw real waveform smoothly
  const drawWaveform = (buffer: any, canvas: HTMLCanvasElement, color: string) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = buffer.getChannelData(0);
    const step = Math.ceil(data.length / canvas.width);
    const amp = canvas.height / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Add a professional glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, amp);
    
    // Draw top half
    for (let i = 0; i < canvas.width; i++) {
      let max = 0;
      for (let j = 0; j < step; j++) {
        const datum = data[(i * step) + j]; 
        if (datum > max) max = datum;
      }
      ctx.lineTo(i, (1 - max) * amp);
    }
    
    // Draw bottom half backwards
    for (let i = canvas.width - 1; i >= 0; i--) {
      let min = 0;
      for (let j = 0; j < step; j++) {
        const datum = data[(i * step) + j]; 
        if (datum < min) min = datum;
      }
      ctx.lineTo(i, (1 - min) * amp);
    }
    
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0; // reset
  };

  useEffect(() => {
    let isMounted = true;
    // Tutti i nodi Tone creati: vengono distrutti TUTTI al cleanup (niente accumulo tra le visite)
    const nodes: any[] = [];
    const track = <T,>(node: T): T => { nodes.push(node); return node; };

    const initAudio = async () => {
      try {
        // Verifica che i file audio esistano prima di decodificarli (errore chiaro se mancano)
        for (const url of ["/track_a.mp3", "/track_b.mp3"]) {
          const res = await fetch(url, { method: "HEAD" });
          if (!res.ok) throw new Error(`file audio mancante: ${url} (HTTP ${res.status})`);
        }
        if (!isMounted) return;

        // --- MASTER CHAIN TRASPARENTE ---
        // Le tracce sono già masterizzate: compressione leggera + limiter di sicurezza, nessun boost EQ
        const masterCompressor = track(new Tone.Compressor({
          threshold: -10,
          ratio: 2,
          attack: 0.01,
          release: 0.2
        }));
        
        // Limiter: Brickwall a -1dBFS per evitare distorsioni
        const masterLimiter = track(new Tone.Limiter(-1).toDestination());
        
        // Collega CrossFader -> Compressore -> Limiter -> Casse
        const crossFader = track(new Tone.CrossFade(0.5).chain(masterCompressor, masterLimiter));
        // --- DECK A ---
        const eqA = track(new Tone.EQ3(0, 0, 0));
        const filterA = track(new Tone.Filter(20000, "lowpass"));
        const padReverbA = track(new Tone.Reverb({ decay: 4, preDelay: 0.05 }));
        const padDelayA = track(new Tone.PingPongDelay("4n", 0.45));
        const padFlangerA = track(new Tone.Chorus({ frequency: 1, delayTime: 3.5, depth: 0.9, feedback: 0.5 }));
        const padEchoA = track(new Tone.FeedbackDelay("4n", 0.55));
        // Volume iniziale allineato allo slider (defaultValue 80)
        const volA = track(new Tone.Volume(sliderToDb(DEFAULT_VOLUME_SLIDER)));
        
        padReverbA.wet.value = 0;
        padDelayA.wet.value = 0;
        padFlangerA.wet.value = 0;
        padEchoA.wet.value = 0;
        
        const playerA = track(new Tone.Player({
          url: "/track_a.mp3",
          loop: true,
          autostart: false
        }).chain(padReverbA, padDelayA, padFlangerA, padEchoA, filterA, eqA, volA, crossFader.a));

        // --- DECK B ---
        const eqB = track(new Tone.EQ3(0, 0, 0));
        const filterB = track(new Tone.Filter(20000, "lowpass"));
        const padReverbB = track(new Tone.Reverb({ decay: 4, preDelay: 0.05 }));
        const padDelayB = track(new Tone.PingPongDelay("4n", 0.45));
        const padFlangerB = track(new Tone.Chorus({ frequency: 1, delayTime: 3.5, depth: 0.9, feedback: 0.5 }));
        const padEchoB = track(new Tone.FeedbackDelay("4n", 0.55));
        const volB = track(new Tone.Volume(sliderToDb(DEFAULT_VOLUME_SLIDER)));
        
        padReverbB.wet.value = 0;
        padDelayB.wet.value = 0;
        padFlangerB.wet.value = 0;
        padEchoB.wet.value = 0;
        
        const playerB = track(new Tone.Player({
          url: "/track_b.mp3",
          loop: true,
          autostart: false
        }).chain(padReverbB, padDelayB, padFlangerB, padEchoB, filterB, eqB, volB, crossFader.b));
        
        await Tone.loaded();
        if (!isMounted) return; // smontato durante il caricamento: il cleanup ha già distrutto i nodi
        await padReverbA.generate();
        await padReverbB.generate();
        if (!isMounted) return;
        padFlangerA.start();
        padFlangerB.start();

        setLoaded(true);
        engineRef.current = {
          playerA, playerB,
          eqA, eqB,
          filterA, filterB,
          padReverbA, padReverbB,
          padDelayA, padDelayB,
          padFlangerA, padFlangerB,
          padEchoA, padEchoB,
          volA, volB,
          crossFader,
          // Posizione reale nel brano (secondi), aggiornata tenendo conto del playbackRate
          posA: 0, posB: 0,
          lastTickA: 0, lastTickB: 0,
          rateA: 1, rateB: 1
        };

        if (canvasARef.current && playerA.buffer) {
           drawWaveform(playerA.buffer, canvasARef.current, '#00f0ff');
        }
        if (canvasBRef.current && playerB.buffer) {
           drawWaveform(playerB.buffer, canvasBRef.current, '#ff3366');
        }
      } catch (err: any) {
        if (isMounted) setErrorMsg("Errore: " + err.message);
      }
    };
    initAudio();
    
    return () => {
      isMounted = false;
      if(rafRefA.current) cancelAnimationFrame(rafRefA.current);
      if(rafRefB.current) cancelAnimationFrame(rafRefB.current);
      // Distrugge TUTTI i nodi audio creati (player, effetti, eq, filtri, volumi, crossfader, master)
      nodes.forEach(n => { try { n.dispose(); } catch {} });
      nodes.length = 0;
      engineRef.current = null;
    };
  }, []);

  // Avanza la posizione del deck in base al tempo trascorso * playbackRate (pitch)
  const tickPosition = (deck: 'A' | 'B') => {
    const e = engineRef.current;
    if (!e) return 0;
    const player = deck === 'A' ? e.playerA : e.playerB;
    const duration = player.buffer.duration;
    const now = Tone.now();
    if (player.state === "started") {
      e[`pos${deck}`] = (e[`pos${deck}`] + (now - e[`lastTick${deck}`]) * e[`rate${deck}`]) % duration;
    }
    e[`lastTick${deck}`] = now;
    return e[`pos${deck}`];
  };

  const updateProgressA = () => {
    if(!engineRef.current) return;
    const player = engineRef.current.playerA;
    if(player.state === "started") {
      setProgressA(tickPosition('A') / player.buffer.duration);
      rafRefA.current = requestAnimationFrame(updateProgressA);
    }
  };

  const updateProgressB = () => {
    if(!engineRef.current) return;
    const player = engineRef.current.playerB;
    if(player.state === "started") {
      setProgressB(tickPosition('B') / player.buffer.duration);
      rafRefB.current = requestAnimationFrame(updateProgressB);
    }
  };

  // ----------------------------------------------------
  // SCRUBBING / SCRATCHING LOGIC
  // ----------------------------------------------------
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!engineRef.current) return;
      
      if (isDraggingA && engineRef.current.playerA.buffer) {
        const deltaX = e.clientX - dragStartX.current;
        let newProgress = dragStartProgress.current - (deltaX / CANVAS_WIDTH);
        if (newProgress < 0) newProgress = 0;
        if (newProgress > 1) newProgress = 1;
        setProgressA(newProgress);
        
        const duration = engineRef.current.playerA.buffer.duration;
        const newTime = newProgress * duration;
        if (engineRef.current.playerA.state === "started") {
           engineRef.current.playerA.seek(newTime);
        }
        engineRef.current.posA = newTime;
        engineRef.current.lastTickA = Tone.now();
      }
      
      if (isDraggingB && engineRef.current.playerB.buffer) {
        const deltaX = e.clientX - dragStartX.current;
        let newProgress = dragStartProgress.current - (deltaX / CANVAS_WIDTH);
        if (newProgress < 0) newProgress = 0;
        if (newProgress > 1) newProgress = 1;
        setProgressB(newProgress);
        
        const duration = engineRef.current.playerB.buffer.duration;
        const newTime = newProgress * duration;
        if (engineRef.current.playerB.state === "started") {
           engineRef.current.playerB.seek(newTime);
        }
        engineRef.current.posB = newTime;
        engineRef.current.lastTickB = Tone.now();
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDraggingA) {
        setIsDraggingA(false);
        if (engineRef.current && engineRef.current.playerA.state === "started") {
          if (rafRefA.current) cancelAnimationFrame(rafRefA.current);
          updateProgressA(); // Resume animation loop
        }
      }
      if (isDraggingB) {
        setIsDraggingB(false);
        if (engineRef.current && engineRef.current.playerB.state === "started") {
          if (rafRefB.current) cancelAnimationFrame(rafRefB.current);
          updateProgressB(); // Resume animation loop
        }
      }
    };

    if (isDraggingA || isDraggingB) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDraggingA, isDraggingB]);

  const onWaveformDownA = (e: React.MouseEvent) => {
    if (!engineRef.current || !engineRef.current.playerA.buffer) return;
    setIsDraggingA(true);
    dragStartX.current = e.clientX;
    dragStartProgress.current = progressA;
    if (rafRefA.current) cancelAnimationFrame(rafRefA.current); // stop loop while dragging
  };

  const onWaveformDownB = (e: React.MouseEvent) => {
    if (!engineRef.current || !engineRef.current.playerB.buffer) return;
    setIsDraggingB(true);
    dragStartX.current = e.clientX;
    dragStartProgress.current = progressB;
    if (rafRefB.current) cancelAnimationFrame(rafRefB.current); // stop loop while dragging
  };

  // ----------------------------------------------------

  const handlePlayA = async () => {
    try {
      await Tone.start();
      if (!loaded || !engineRef.current) return;
      const e = engineRef.current;
      if (isPlayingA) {
        tickPosition('A'); // salva la posizione esatta prima di fermare
        e.playerA.stop();
        if(rafRefA.current) cancelAnimationFrame(rafRefA.current);
      } else {
        e.playerA.start(Tone.now(), e.posA);
        e.lastTickA = Tone.now();
        updateProgressA();
      }
      setIsPlayingA(!isPlayingA);
    } catch (err: any) {
      setErrorMsg("Errore: " + err.message);
    }
  };
  
  const handlePlayB = async () => {
    try {
      await Tone.start();
      if (!loaded || !engineRef.current) return;
      const e = engineRef.current;
      if (isPlayingB) {
        tickPosition('B');
        e.playerB.stop();
        if(rafRefB.current) cancelAnimationFrame(rafRefB.current);
      } else {
        e.playerB.start(Tone.now(), e.posB);
        e.lastTickB = Tone.now();
        updateProgressB();
      }
      setIsPlayingB(!isPlayingB);
    } catch (err: any) {
      setErrorMsg("Errore: " + err.message);
    }
  };

  const RAMP = 0.05; // 50ms: transizioni morbide, niente click

  const triggerPad = (deck: 'A'|'B', fx: 'reverb'|'delay'|'flanger'|'echo', rate: '4n'|'8n', enable: boolean) => {
    if(!engineRef.current) return;
    const e = engineRef.current;
    
    // Tempi calcolati dal BPM della traccia e dal pitch attuale del deck (restano a tempo)
    const beatSec = 60 / (TRACK_BPM[deck] * e[`rate${deck}`]);
    const delayTimeSec = rate === '4n' ? beatSec : beatSec / 2;

    if (fx === 'reverb') {
      const rev = deck === 'A' ? e.padReverbA : e.padReverbB;
      // Reverb wet max 40-60% per non annegare la traccia
      rev.wet.rampTo(enable ? (rate === '4n' ? 0.4 : 0.6) : 0, RAMP);
    }
    if (fx === 'delay') {
      const del = deck === 'A' ? e.padDelayA : e.padDelayB;
      del.delayTime.rampTo(delayTimeSec, RAMP);
      // Feedback moderato: niente accumulo/distorsione se combinato con l'echo
      del.feedback.rampTo(0.45, RAMP);
      del.wet.rampTo(enable ? 0.4 : 0, RAMP);
    }
    if (fx === 'flanger') {
      const fla = deck === 'A' ? e.padFlangerA : e.padFlangerB;
      fla.frequency.rampTo(rate === '4n' ? 0.5 : 2, RAMP);
      fla.wet.rampTo(enable ? 0.5 : 0, RAMP);
    }
    if (fx === 'echo') {
      const ech = deck === 'A' ? e.padEchoA : e.padEchoB;
      ech.delayTime.rampTo(delayTimeSec, RAMP);
      ech.feedback.rampTo(0.55, RAMP);
      ech.wet.rampTo(enable ? 0.5 : 0, RAMP);
    }
  };

  const setFilter = (deck: 'A'|'B', value: number) => {
    if(!engineRef.current) return;
    // NB: il filtro NON spegne più gli effetti attivi
    const filter = deck === 'A' ? engineRef.current.filterA : engineRef.current.filterB;
    let type: 'lowpass' | 'highpass' = 'lowpass';
    let freq = 20000;
    if (value < 48) {
      freq = 20 * Math.pow(1000, value / 50);          // 20Hz -> ~20kHz, curva esponenziale
    } else if (value > 52) {
      type = 'highpass';
      freq = 20 * Math.pow(500, (value - 50) / 50);    // 20Hz -> 10kHz, curva esponenziale
    }
    if (filter.type !== type) {
      // Cambio tipo: salta direttamente alla frequenza per non attraversare tutto lo spettro
      filter.type = type;
      filter.frequency.value = freq;
    } else {
      filter.frequency.rampTo(freq, RAMP);
    }
  };

  const setActiveFx = (deck: 'A'|'B', next: Record<string, boolean>) => {
    activeFxRef.current[deck] = next;
    (deck === 'A' ? setActiveFxA : setActiveFxB)(next);
  };

  const clearFx = (deck: 'A'|'B') => {
    const current = activeFxRef.current[deck];
    Object.keys(current).forEach(key => {
      if (current[key]) {
        const [fx, rate] = key.split('-');
        triggerPad(deck, fx as any, rate as any, false);
      }
    });
    setActiveFx(deck, {});
  };

  const toggleFx = (deck: 'A'|'B', fx: 'reverb'|'delay'|'flanger'|'echo', rate: '4n'|'8n') => {
    const key = `${fx}-${rate}`;
    const current = activeFxRef.current[deck];
    const nextState = !current[key];
    triggerPad(deck, fx, rate, nextState);   // side effect audio FUORI dall'updater di setState
    setActiveFx(deck, { ...current, [key]: nextState });
  };

  const setEQ = (deck: 'A'|'B', band: 'low'|'mid'|'high', value: number) => {
    if(!engineRef.current) return;
    // NB: l'EQ NON spegne più gli effetti attivi
    const eq = deck === 'A' ? engineRef.current.eqA : engineRef.current.eqB;
    // 0 = kill (-26dB), 50 = 0dB (neutro), 100 = +6dB
    const db = value <= 50 ? ((value - 50) / 50) * 26 : ((value - 50) / 50) * 6;
    if(band === 'low') eq.low.rampTo(db, RAMP);
    if(band === 'mid') eq.mid.rampTo(db, RAMP);
    if(band === 'high') eq.high.rampTo(db, RAMP);
  };

  const setPitch = (deck: 'A'|'B', value: number) => {
    if(!engineRef.current) return;
    const e = engineRef.current;
    const p = deck === 'A' ? e.playerA : e.playerB;
    tickPosition(deck); // chiude il tratto col vecchio rate prima di cambiarlo
    // 50 = 1x speed. Range from 0.8x to 1.2x (+/- 20% like a turntable)
    const rate = 0.8 + ((value / 100) * 0.4);
    p.playbackRate = rate;
    e[`rate${deck}`] = rate;
    // Riallinea delay/echo attivi al nuovo tempo
    Object.entries(activeFxRef.current[deck]).forEach(([key, on]) => {
      const [fx, r] = key.split('-');
      if (on && (fx === 'delay' || fx === 'echo')) triggerPad(deck, fx, r as any, true);
    });
  };

  const setVolume = (deck: 'A'|'B', value: number) => {
    if(!engineRef.current) return;
    const vol = deck === 'A' ? engineRef.current.volA : engineRef.current.volB;
    // Curva naturale, massimo 0 dB (prima arrivava a +12 dB e distorceva)
    vol.volume.rampTo(sliderToDb(value), RAMP);
  };

  const setCrossfade = (value: number) => {
    if(!engineRef.current) return;
    engineRef.current.crossFader.fade.value = value / 100;
  };

  return (
    <main className="min-h-screen" style={{ background: '#0a0c10', color: '#fff', paddingTop: '100px', paddingBottom: '100px' }}>
      <Navbar />
      <div className="max-w-[1600px] mx-auto px-4">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', background: 'linear-gradient(90deg, #00f0ff, #ff3366)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            WEB3 MIXER PRO
          </h1>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: loaded ? '#00ff33' : '#ffcc00', boxShadow: loaded ? '0 0 10px #00ff33' : '0 0 10px #ffcc00' }}></div>
             <span style={{ fontSize: '0.9rem' }}>{loaded ? 'READY (Audio Loaded)' : 'DECODING REAL AUDIO WAVEFORM (Wait 10-15s)...'}</span>
          </div>
        </div>

        {/* STACKED REAL WAVEFORMS (REKORDBOX STYLE) */}
        <div style={{ width: '100%', height: '200px', background: '#050505', borderRadius: '10px', marginBottom: '30px', border: '2px solid #222', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
           {/* Center Playhead Needle */}
           <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: '#fff', zIndex: 10, boxShadow: '0 0 10px #fff' }}></div>
           
           {/* Deck A Waveform */}
           <div onMouseDown={onWaveformDownA} style={{ flex: 1, borderBottom: '1px solid #222', position: 'relative', overflow: 'hidden', cursor: isDraggingA ? 'grabbing' : 'grab' }}>
             
             {/* TRACK INFO A */}
             <div style={{ position: 'absolute', left: '20px', top: '10px', zIndex: 20, display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00f0ff', textShadow: '0 0 5px #000' }}>FLOWPULSE ANTHEM (Extended Mix)</span>
                <span style={{ fontSize: '0.8rem', color: '#fff', textShadow: '0 0 5px #000' }}>UNKNOWN ARTIST</span>
             </div>

             <div style={{ position: 'absolute', left: `calc(50% - ${progressA * CANVAS_WIDTH}px)`, height: '100%', width: `${CANVAS_WIDTH}px`, top: '0', transition: (isPlayingA || isDraggingA) ? 'none' : 'left 0.1s' }}>
                <canvas ref={canvasARef} width={CANVAS_WIDTH} height={100} style={{ width: '100%', height: '100%' }}></canvas>
             </div>
           </div>

           {/* Deck B Waveform */}
           <div onMouseDown={onWaveformDownB} style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: isDraggingB ? 'grabbing' : 'grab' }}>
             
             {/* TRACK INFO B */}
             <div style={{ position: 'absolute', left: '20px', top: '10px', zIndex: 20, display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ff3366', textShadow: '0 0 5px #000' }}>TECHNO BEAT (Original Mix)</span>
                <span style={{ fontSize: '0.8rem', color: '#fff', textShadow: '0 0 5px #000' }}>UNKNOWN ARTIST</span>
             </div>

             <div style={{ position: 'absolute', left: `calc(50% - ${progressB * CANVAS_WIDTH}px)`, height: '100%', width: `${CANVAS_WIDTH}px`, top: '0', transition: (isPlayingB || isDraggingB) ? 'none' : 'left 0.1s' }}>
                <canvas ref={canvasBRef} width={CANVAS_WIDTH} height={100} style={{ width: '100%', height: '100%' }}></canvas>
             </div>
           </div>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(255,0,0,0.2)', color: '#ff3333', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #ff3333' }}>
            {errorMsg}
          </div>
        )}

        <div className="grid-mobile-col" style={{ display: 'flex', gap: '20px', alignItems: 'stretch' }}>
          
          {/* DECK A */}
          <div className="glass-panel" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
            <h2 style={{ color: '#00f0ff', marginBottom: '10px', fontWeight: 'bold' }}>DECK A</h2>
            
            <div style={{ width: '220px', height: '220px', borderRadius: '50%', background: '#1a1a1a', border: '5px solid #333', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: '20px', boxShadow: isPlayingA ? '0 0 30px rgba(0, 240, 255, 0.4)' : '0 0 20px rgba(0, 240, 255, 0.2)', transition: 'all 0.2s' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#00f0ff', opacity: 0.8 }}></div>
              <div style={{ position: 'absolute', top: 0, width: '4px', height: '105px', background: '#fff', transformOrigin: 'bottom center', animation: isPlayingA ? 'spin 2s linear infinite' : 'none' }}></div>
            </div>

            <div style={{ display: 'flex', gap: '15px', width: '100%', justifyContent: 'center', marginBottom: '20px' }}>
              <button onClick={handlePlayA} style={{ background: isPlayingA ? '#00f0ff' : '#222', color: isPlayingA ? 'black' : '#00f0ff', border: '2px solid #00f0ff', padding: '15px 30px', borderRadius: '50px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>
                {isPlayingA ? 'PAUSE' : 'PLAY'}
              </button>
            </div>

            {/* PERFORMANCE PADS (Real FX) */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '20px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#00f0ff', padding: '0 5px', fontWeight: 'bold' }}>
                 <span>REVERB</span><span>DELAY</span><span>FLANGER</span><span>ECHO</span>
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                 <div className={`pad pad-blue ${activeFxA['reverb-4n'] ? 'active' : ''}`} onClick={()=>toggleFx('A','reverb','4n')}>1/4</div>
                 <div className={`pad pad-blue ${activeFxA['delay-4n'] ? 'active' : ''}`} onClick={()=>toggleFx('A','delay','4n')}>1/4</div>
                 <div className={`pad pad-blue ${activeFxA['flanger-4n'] ? 'active' : ''}`} onClick={()=>toggleFx('A','flanger','4n')}>1/4</div>
                 <div className={`pad pad-blue ${activeFxA['echo-4n'] ? 'active' : ''}`} onClick={()=>toggleFx('A','echo','4n')}>1/4</div>
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '5px' }}>
                 <div className={`pad pad-dark ${activeFxA['reverb-8n'] ? 'active' : ''}`} onClick={()=>toggleFx('A','reverb','8n')}>1/8</div>
                 <div className={`pad pad-dark ${activeFxA['delay-8n'] ? 'active' : ''}`} onClick={()=>toggleFx('A','delay','8n')}>1/8</div>
                 <div className={`pad pad-dark ${activeFxA['flanger-8n'] ? 'active' : ''}`} onClick={()=>toggleFx('A','flanger','8n')}>1/8</div>
                 <div className={`pad pad-dark ${activeFxA['echo-8n'] ? 'active' : ''}`} onClick={()=>toggleFx('A','echo','8n')}>1/8</div>
               </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', width: '100%', background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.8rem' }}>Pitch -</span>
              <input type="range" min="0" max="100" defaultValue="50" style={{ flex: 1 }} onChange={(e)=>setPitch('A', Number(e.target.value))} />
              <span style={{ fontSize: '0.8rem' }}>+</span>
            </div>
          </div>

          {/* CENTRAL MIXER */}
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
            <div className="grid-mobile-col" style={{ display: 'flex', width: '100%', justifyContent: 'space-between', gap: '20px' }}>
              
              {/* CH A Strip */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', background: 'rgba(0, 240, 255, 0.05)', padding: '15px', borderRadius: '10px', flex: 1 }}>
                <span style={{ color: '#00f0ff', fontWeight: 'bold' }}>CH A</span>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '0.7rem' }}>HI</span><br/><input type="range" min="0" max="100" defaultValue="50" style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '60px' }} onChange={(e)=>setEQ('A', 'high', Number(e.target.value))} /></div>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '0.7rem' }}>MID</span><br/><input type="range" min="0" max="100" defaultValue="50" style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '60px' }} onChange={(e)=>setEQ('A', 'mid', Number(e.target.value))} /></div>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '0.7rem', color: '#00f0ff' }}>LOW</span><br/><input type="range" min="0" max="100" defaultValue="50" style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '60px' }} onChange={(e)=>setEQ('A', 'low', Number(e.target.value))} /></div>
                
                {/* FILTER KNOB */}
                <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px 5px', borderRadius: '8px', width: '100%' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'white' }}>FILTER</span><br/>
                  <input type="range" min="0" max="100" defaultValue="50" style={{ width: '100%', marginTop: '5px' }} onChange={(e)=>setFilter('A', Number(e.target.value))} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: '#888', marginTop: '2px' }}>
                     <span>LPF</span><span>HPF</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                  <input type="range" min="0" max="100" defaultValue="80" style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '140px', cursor: 'pointer' }} onChange={(e)=>setVolume('A', Number(e.target.value))} />
                </div>
              </div>

              {/* CH B Strip */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', background: 'rgba(255, 51, 102, 0.05)', padding: '15px', borderRadius: '10px', flex: 1 }}>
                <span style={{ color: '#ff3366', fontWeight: 'bold' }}>CH B</span>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '0.7rem' }}>HI</span><br/><input type="range" min="0" max="100" defaultValue="50" style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '60px' }} onChange={(e)=>setEQ('B', 'high', Number(e.target.value))} /></div>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '0.7rem' }}>MID</span><br/><input type="range" min="0" max="100" defaultValue="50" style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '60px' }} onChange={(e)=>setEQ('B', 'mid', Number(e.target.value))} /></div>
                <div style={{ textAlign: 'center' }}><span style={{ fontSize: '0.7rem', color: '#ff3366' }}>LOW</span><br/><input type="range" min="0" max="100" defaultValue="50" style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '60px' }} onChange={(e)=>setEQ('B', 'low', Number(e.target.value))} /></div>
                
                {/* FILTER KNOB */}
                <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px 5px', borderRadius: '8px', width: '100%' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'white' }}>FILTER</span><br/>
                  <input type="range" min="0" max="100" defaultValue="50" style={{ width: '100%', marginTop: '5px' }} onChange={(e)=>setFilter('B', Number(e.target.value))} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: '#888', marginTop: '2px' }}>
                     <span>LPF</span><span>HPF</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                  <input type="range" min="0" max="100" defaultValue="80" style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '140px', cursor: 'pointer' }} onChange={(e)=>setVolume('B', Number(e.target.value))} />
                </div>
              </div>
            </div>

            <div style={{ width: '100%', marginTop: '40px', background: 'rgba(0,0,0,0.5)', padding: '20px 10px', borderRadius: '10px' }}>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888', margin: '0 0 10px 0' }}>CROSSFADER</p>
              <input type="range" min="0" max="100" defaultValue="50" style={{ width: '100%', height: '8px', cursor: 'pointer' }} onChange={(e)=>setCrossfade(Number(e.target.value))} />
            </div>
          </div>


          {/* DECK B */}
          <div className="glass-panel" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255, 51, 102, 0.05)', border: '1px solid rgba(255, 51, 102, 0.2)' }}>
            <h2 style={{ color: '#ff3366', marginBottom: '10px', fontWeight: 'bold' }}>DECK B</h2>
            
            <div style={{ width: '220px', height: '220px', borderRadius: '50%', background: '#1a1a1a', border: '5px solid #333', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: '20px', boxShadow: isPlayingB ? '0 0 30px rgba(255, 51, 102, 0.4)' : '0 0 20px rgba(255, 51, 102, 0.2)', transition: 'all 0.2s' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#ff3366', opacity: 0.8 }}></div>
              <div style={{ position: 'absolute', top: 0, width: '4px', height: '105px', background: '#fff', transformOrigin: 'bottom center', animation: isPlayingB ? 'spin 2s linear infinite' : 'none' }}></div>
            </div>

            <div style={{ display: 'flex', gap: '15px', width: '100%', justifyContent: 'center', marginBottom: '20px' }}>
              <button onClick={handlePlayB} style={{ background: isPlayingB ? '#ff3366' : '#222', color: isPlayingB ? 'black' : '#ff3366', border: '2px solid #ff3366', padding: '15px 30px', borderRadius: '50px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>
                {isPlayingB ? 'PAUSE' : 'PLAY'}
              </button>
            </div>
            
            {/* PERFORMANCE PADS (Real FX) */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '20px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#ff3366', padding: '0 5px', fontWeight: 'bold' }}>
                 <span>REVERB</span><span>DELAY</span><span>FLANGER</span><span>ECHO</span>
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                 <div className={`pad pad-red ${activeFxB['reverb-4n'] ? 'active' : ''}`} onClick={()=>toggleFx('B','reverb','4n')}>1/4</div>
                 <div className={`pad pad-red ${activeFxB['delay-4n'] ? 'active' : ''}`} onClick={()=>toggleFx('B','delay','4n')}>1/4</div>
                 <div className={`pad pad-red ${activeFxB['flanger-4n'] ? 'active' : ''}`} onClick={()=>toggleFx('B','flanger','4n')}>1/4</div>
                 <div className={`pad pad-red ${activeFxB['echo-4n'] ? 'active' : ''}`} onClick={()=>toggleFx('B','echo','4n')}>1/4</div>
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '5px' }}>
                 <div className={`pad pad-dark ${activeFxB['reverb-8n'] ? 'active' : ''}`} onClick={()=>toggleFx('B','reverb','8n')}>1/8</div>
                 <div className={`pad pad-dark ${activeFxB['delay-8n'] ? 'active' : ''}`} onClick={()=>toggleFx('B','delay','8n')}>1/8</div>
                 <div className={`pad pad-dark ${activeFxB['flanger-8n'] ? 'active' : ''}`} onClick={()=>toggleFx('B','flanger','8n')}>1/8</div>
                 <div className={`pad pad-dark ${activeFxB['echo-8n'] ? 'active' : ''}`} onClick={()=>toggleFx('B','echo','8n')}>1/8</div>
               </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', width: '100%', background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.8rem' }}>Pitch -</span>
              <input type="range" min="0" max="100" defaultValue="50" style={{ flex: 1 }} onChange={(e)=>setPitch('B', Number(e.target.value))} />
              <span style={{ fontSize: '0.8rem' }}>+</span>
            </div>
          </div>

        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .pad {
            height: 50px;
            border-radius: 6px;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
            border: 1px solid #333;
            cursor: pointer;
            transition: all 0.1s;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: bold;
            color: rgba(255,255,255,0.7);
            user-select: none;
          }
          .pad:active {
            transform: scale(0.95);
          }
          .pad.active {
            background: #fff !important;
            color: #000 !important;
            box-shadow: 0 0 15px rgba(255,255,255,0.8);
          }
          .pad-blue {
            background: #0088ff;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.5), 0 0 10px rgba(0,240,255,0.4);
            border: 1px solid #00f0ff;
          }
          .pad-red {
            background: #cc0033;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.5), 0 0 10px rgba(255,51,102,0.4);
            border: 1px solid #ff3366;
          }
          .pad-blue:active { background: #fff; color: #000; }
          .pad-red:active { background: #fff; color: #000; }
          .pad-dark {
            background: #111;
            border: 1px solid #444;
          }
          .pad-dark:hover {
            background: #222;
          }
          .pad-dark:active {
            background: #fff;
            color: #000;
          }
        `}} />
      </div>
    </main>
  );
}
