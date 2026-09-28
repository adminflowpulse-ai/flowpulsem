"use client";
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const INITIAL_DATA = [
  { name: '10:00', FPM: 0.000, ArtistToken: 0.000 },
  { name: '10:05', FPM: 0.000, ArtistToken: 0.000 },
  { name: '10:10', FPM: 0.000, ArtistToken: 0.000 },
  { name: '10:15', FPM: 0.000, ArtistToken: 0.000 },
  { name: '10:20', FPM: 0.000, ArtistToken: 0.000 },
  { name: '10:25', FPM: 0.000, ArtistToken: 0.000 },
  { name: '10:30', FPM: 0.000, ArtistToken: 0.000 },
];

export default function MarketChart() {
  const [data, setData] = useState(INITIAL_DATA);
  const [currentFPM, setCurrentFPM] = useState(0.000);
  const [change, setChange] = useState('+0.00%');

  useEffect(() => {
    // Simulazione di mercato Live
    const interval = setInterval(() => {
      setData((prevData) => {
        const lastData = prevData[prevData.length - 1];
        
        // Random fluctuation tra -0.005 e +0.010
        const fpmFluctuation = (0) - 0.005;
        const coxFluctuation = (0) - 0.003;
        
        const newFPM = Math.max(0.0, Number((lastData.FPM + fpmFluctuation).toFixed(3)));
        const newCox = Math.max(0.05, Number((lastData.ArtistToken + coxFluctuation).toFixed(3)));
        
        const timeParts = lastData.name.split(':');
        let mins = parseInt(timeParts[1]) + 5;
        let hours = parseInt(timeParts[0]);
        if (mins >= 60) {
          mins -= 60;
          hours += 1;
        }
        const newTime = `${hours}:${mins < 10 ? '0'+mins : mins}`;

        const newDataPoint = { name: newTime, FPM: newFPM, ArtistToken: newCox };
        
        // Mantieni solo gli ultimi 15 punti
        const newArray = [...prevData, newDataPoint];
        if (newArray.length > 15) newArray.shift();

        setCurrentFPM(newFPM);
        
        // Calcola % change rispetto all'inizio
        const startFPM = INITIAL_DATA[0].FPM;
        const percentChange = (((newFPM - startFPM) / startFPM) * 100);
        setChange(percentChange >= 0 ? `+${percentChange.toFixed(1)}%` : `${percentChange.toFixed(1)}%`);
        
        return newArray;
      });
    }, 3000); // Aggiorna ogni 3 secondi per dare un forte effetto "live"

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '2rem', width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff00', animation: 'pulseGlow 2s infinite' }}></div>
        <span style={{ fontSize: '0.7rem', color: '#00ff00', fontWeight: 'bold' }}>LIVE MARKET</span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Ecosistema FPM vs Token Artisti</h3>
          <p style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>Valore scambi in tempo reale ($USD)</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-highlight)', margin: 0 }}>
            ${currentFPM.toFixed(3)} 
            <span style={{ color: change.startsWith('+') ? '#00f0ff' : '#ff007f', fontSize: '1.2rem', marginLeft: '10px' }}>{change}</span>
          </h2>
        </div>
      </div>
      
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorFPM" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8a2be2" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8a2be2" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCox" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" />
            <YAxis stroke="rgba(255,255,255,0.3)" domain={['dataMin - 0.05', 'dataMax + 0.05']} />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 33, 47, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
            <Area type="monotone" dataKey="FPM" stroke="#8a2be2" strokeWidth={3} fillOpacity={1} fill="url(#colorFPM)" isAnimationActive={false} />
            <Area type="monotone" dataKey="ArtistToken" stroke="#00f0ff" strokeWidth={3} fillOpacity={1} fill="url(#colorCox)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
