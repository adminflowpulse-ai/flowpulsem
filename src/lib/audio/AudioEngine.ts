/**
 * FlowPulse Audio Engine
 * Advanced Web Audio API Wrapper for scheduling and synthesis.
 */
export class AudioEngine {
    private static instance: AudioEngine;
    public ctx: AudioContext | null = null;
    public isPlaying: boolean = false;
    public bpm: number = 128;
    
    // Lookahead scheduling
    private scheduleAheadTime = 0.1; 
    private nextNoteTime = 0.0;
    private current16thNote = 0;
    private timerID: NodeJS.Timeout | null = null;

    private constructor() {
        // Init context lazily to avoid browser autoplay block
    }

    public static getInstance(): AudioEngine {
        if (!AudioEngine.instance) {
            AudioEngine.instance = new AudioEngine();
        }
        return AudioEngine.instance;
    }

    public init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    public setBpm(bpm: number) {
        this.bpm = bpm;
    }

    private tracks: any[] = [];
    private currentStep = 0;
    
    public setTracks(tracks: any[]) {
        this.tracks = tracks;
    }

    public play() {
        this.init();
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.nextNoteTime = this.ctx!.currentTime + 0.05;
        this.scheduler();
    }

    public stop() {
        this.isPlaying = false;
        if (this.timerID) {
            clearTimeout(this.timerID);
            this.timerID = null;
        }
        // We do not reset currentStep so play/pause works, but for now let's reset to start
        this.currentStep = 0;
    }

    private nextNote() {
        const secondsPerBeat = 60.0 / this.bpm;
        // 16th note duration = 0.25 of a beat
        this.nextNoteTime += 0.25 * secondsPerBeat; 
        this.currentStep++;
        if (this.currentStep >= 32) {
            this.currentStep = 0; // Loop back after 32 steps (2 bars)
        }
    }

    private scheduler() {
        while (this.nextNoteTime < this.ctx!.currentTime + this.scheduleAheadTime) {
            this.playNotesForStep(this.currentStep, this.nextNoteTime);
            this.nextNote();
        }
        this.timerID = setTimeout(() => this.scheduler(), 25.0);
    }

    private playNotesForStep(step: number, time: number) {
        if (!this.tracks || this.tracks.length === 0) return;
        
        this.tracks.forEach(track => {
             track.clips.forEach((clip: any) => {
                 // Convert clip percentage (0-100) to grid step (0-31)
                 const clipStep = Math.round((clip.start / 100) * 32);
                 if (clipStep === step) {
                     this.triggerSynthAtTime(track.name.toLowerCase(), time, 440);
                 }
             });
        });
    }

    public triggerSynth(type: string, pitchBase: number = 440) {
        this.init();
        if (!this.ctx) return;
        this.triggerSynthAtTime(type, this.ctx.currentTime, pitchBase);
    }

    private triggerSynthAtTime(type: string, time: number, pitchBase: number = 440) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        if (type.includes('kick')) {
            osc.frequency.setValueAtTime(150, time);
            osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
            gain.gain.setValueAtTime(1, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
            osc.start(time); osc.stop(time + 0.5);
        } else if (type.includes('snare') || type.includes('clap')) {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(pitchBase * 2, time);
            osc.frequency.exponentialRampToValueAtTime(100, time + 0.2);
            gain.gain.setValueAtTime(0.8, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
            osc.start(time); osc.stop(time + 0.2);
        } else if (type.includes('hat')) {
            osc.type = 'square';
            osc.frequency.setValueAtTime(pitchBase * 5, time);
            gain.gain.setValueAtTime(0.3, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
            osc.start(time); osc.stop(time + 0.05);
        } else {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(pitchBase, time);
            gain.gain.setValueAtTime(0.5, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
            osc.start(time); osc.stop(time + 0.4);
        }
    }
}

export const audioEngine = AudioEngine.getInstance();
