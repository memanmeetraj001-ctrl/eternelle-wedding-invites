// Web Audio API ambient harp & chime synthesizer for instant background music without loading errors
class WeddingAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playNote(freq: number, time: number, duration: number = 2.5) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Soft harp / electric piano timbre
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.12, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  public start() {
    if (this.isPlaying) return;
    this.initContext();
    this.isPlaying = true;

    // Canon in D / Clair de Lune acoustic harp chord progression
    const chords = [
      [293.66, 369.99, 440.0, 587.33], // D maj (D4, F#4, A4, D5)
      [220.0, 277.18, 329.63, 440.0],  // A maj (A3, C#4, E4, A4)
      [246.94, 293.66, 369.99, 493.88],// B min (B3, D4, F#4, B4)
      [185.0, 220.0, 277.18, 369.99],  // F# min (F#3, A3, C#4, F#4)
      [196.0, 246.94, 293.66, 392.0],  // G maj (G3, B3, D4, G4)
      [146.83, 185.0, 220.0, 293.66],  // D maj (D3, F#3, A3, D4)
      [196.0, 246.94, 293.66, 392.0],  // G maj (G3, B3, D4, G4)
      [220.0, 277.18, 329.63, 440.0],  // A maj (A3, C#4, E4, A4)
    ];

    let chordIdx = 0;
    const playLoop = () => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const currentChord = chords[chordIdx % chords.length];

      // Arpeggio notes
      currentChord.forEach((freq, i) => {
        this.playNote(freq, now + i * 0.35, 3.0);
      });

      chordIdx++;
      this.timer = window.setTimeout(playLoop, 2200);
    };

    playLoop();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const weddingAudio = new WeddingAudioPlayer();
